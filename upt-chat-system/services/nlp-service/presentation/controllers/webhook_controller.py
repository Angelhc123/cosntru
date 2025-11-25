"""
Webhook Controller para DialogFlow
RF004 - Password Recovery Integration
"""
from fastapi import APIRouter, Request, HTTPException
from typing import Dict, Any, Optional
import httpx
import re
from infrastructure.logging.logger_config import logger
from config import settings

router = APIRouter()

# URL del API Gateway
API_GATEWAY_BASE_URL = settings.api_gateway_url or "http://localhost:3000"


def extract_email_from_text(text: str, parameters: Dict[str, Any]) -> Optional[str]:
    """
    Extrae un email del texto del usuario.
    Intenta primero desde los parámetros de DialogFlow,
    luego con regex.
    """
    # Intentar desde parámetros
    email = parameters.get("email", "").strip()
    if email:
        return email
    
    # Intentar con regex
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    matches = re.findall(email_pattern, text)
    
    if matches:
        return matches[0]
    
    return None


@router.post("/webhook")
async def dialogflow_webhook(request: Request) -> Dict[str, Any]:
    """
    Webhook endpoint para DialogFlow.
    Maneja el flujo conversacional completo por código.
    
    Flujo para RF004 - Password Recovery:
    1. DialogFlow detecta CUALQUIER intent
    2. Webhook verifica si hay contexto activo de "recuperación de contraseña"
    3. Si hay contexto, procesa el email
    4. Si no hay contexto, inicia el flujo pidiendo email
    """
    try:
        # Parsear el body de DialogFlow
        body = await request.json()
        logger.info(f"📨 Webhook recibido de DialogFlow")
        logger.debug(f"Body completo: {body}")
        
        # Extraer info básica para logging
        query_text = body.get("queryResult", {}).get("queryText", "")
        intent_name = body.get("queryResult", {}).get("intent", {}).get("displayName", "")
        logger.info(f"🚨🚨🚨 INTENT: '{intent_name}' - QUERY: '{query_text}' 🚨🚨🚨")
        
        # Extraer información del request de DialogFlow
        query_result = body.get("queryResult", {})
        intent_name = query_result.get("intent", {}).get("displayName", "")
        parameters = query_result.get("parameters", {})
        session = body.get("session", "")
        query_text = query_result.get("queryText", "")
        output_contexts = query_result.get("outputContexts", [])
        
        logger.info(f"🎯 Intent detectado: {intent_name}")
        logger.info(f"� Query text: {query_text}")
        logger.info(f"�📋 Parámetros: {parameters}")
        logger.info(f"🔄 Contexts: {[c.get('name', '').split('/')[-1] for c in output_contexts]}")
        
        # ===================================================================
        # VERIFICAR SI HAY UN CONTEXTO ACTIVO DE PASSWORD RECOVERY
        # ===================================================================
        awaiting_email_context = None
        for context in output_contexts:
            context_name = context.get("name", "").split("/")[-1]
            if context_name == "awaiting-email":
                awaiting_email_context = context
                logger.info(f"✅ Contexto 'awaiting-email' encontrado - Usuario debe dar email")
                break
        
        # ===================================================================
        # CASO 1: Hay contexto de "awaiting-email" 
        # El usuario está dando su email como respuesta
        # ===================================================================
        if awaiting_email_context:
            logger.info("📧 Procesando email del usuario en contexto...")
            
            # Intentar extraer email del texto del usuario
            email = extract_email_from_text(query_text, parameters)
            
            if email:
                logger.info(f"✅ Email detectado: {email}")
                return await handle_password_recovery_with_email(email, session)
            else:
                logger.warning("⚠️ No se pudo extraer email del texto")
                return {
                    "fulfillmentText": "No pude identificar tu correo electrónico. Por favor escríbelo claramente, por ejemplo: juan.perez@gmail.com",
                    "outputContexts": [
                        {
                            "name": f"{session}/contexts/awaiting-email",
                            "lifespanCount": 2
                        }
                    ]
                }
        
        # ===================================================================
        # CASO 2: Intent de Password Recovery (inicio del flujo)
        # ===================================================================
        if intent_name in ["Contraseña Olvidada", "password_recovery", "password_recovery_start"]:
            # Buscar email en parámetros O en el texto usando regex
            email = extract_email_from_text(query_text, parameters)
            
            if email:
                logger.info(f"✅ Email detectado en intent de recuperación: {email}")
                logger.info("🚀 Procesando directamente - Todo en un mensaje")
                return await handle_password_recovery_with_email(email, session)
            else:
                logger.info("📧 Iniciando flujo - Pidiendo email al usuario")
                return {
                    "fulfillmentText": "Para ayudarte a recuperar tu contraseña, necesito validar tu identidad. Por favor, proporciona tu correo electrónico institucional o personal registrado en la UPT.",
                    "outputContexts": [
                        {
                            "name": f"{session}/contexts/awaiting-email",
                            "lifespanCount": 3  # Dura 3 turnos
                        }
                    ]
                }
        
        # ===================================================================
        # CASO 3: Intent de Saludos
        # ===================================================================
        if intent_name in ["Saludos", "saludos", "greeting"]:
            logger.info("👋 Intent de Saludos detectado")
            return {
                "fulfillmentText": "¡Hola! Soy el Asistente Virtual de la UPT. ¿En qué puedo ayudarte hoy? Puedo asistirte con:\n\n• Recuperación de contraseña\n• Información sobre horarios\n• Consultas generales\n\n¿Qué necesitas?",
            }
        
        # ===================================================================
        # CASO 4: Intent de Información de Matrícula
        # ===================================================================
        if intent_name in ["Informacion de Matricula", "matricula"]:
            logger.info("📚 Intent de Matrícula detectado")
            return {
                "fulfillmentText": "Para información sobre matrícula, te puedo ayudar con:\n\n• Fechas de matrícula\n• Requisitos\n• Proceso de inscripción\n\n¿Qué información específica necesitas?",
            }
        
        # ===================================================================
        # CASO 5: Intent de Consultar Horario del Alumno
        # ===================================================================
        if intent_name in ["Consultar Horario", "consultar_horario", "horario_alumno", "mi horario", "ver mi horario", "quiero ver mi horario", "ver horario"]:
            logger.info("📅 Intent de Consultar Horario detectado")
            intranet_url = "https://fronted-php-production.up.railway.app/alumno?section=horario"
            
            mensaje_pasos = (
                "📅 **Horarios:**\n\n"
                "Para consultar tu horario desde el intranet:\n\n"
                "1️⃣ Ingresa al portal Net.UPT\n"
                "2️⃣ Haz clic en 'Alumno' en el menú lateral\n"
                "3️⃣ Selecciona 'Horario' en las opciones\n"
                "4️⃣ Verás tu horario completo del ciclo actual\n\n"
            )
            
            logger.info("🔥 ENVIANDO PASOS + BOTÓN DE REDIRECCIÓN")
            return {
                "fulfillmentText": f"[REDIRECT_BUTTON|{intranet_url}|📅 Ver Mi Horario|{mensaje_pasos}]",
            }
        
        # ===================================================================
        # CASO 6: Intent de Consultar Notas del Alumno
        # ===================================================================
        if intent_name in ["Consultar Notas", "consultar_notas", "mis notas", "calificaciones", "ver mis notas", "quiero ver mis notas", "ver notas"]:
            logger.info("📊 Intent de Consultar Notas detectado")
            intranet_url = "https://fronted-php-production.up.railway.app/alumno?section=notas"
            
            mensaje_pasos = (
                "📊 **Notas:**\n\n"
                "Para consultar tus notas desde el intranet:\n\n"
                "1️⃣ Ingresa al portal Net.UPT\n"
                "2️⃣ Haz clic en 'Alumno' en el menú lateral\n"
                "3️⃣ Selecciona 'Notas' en las opciones\n"
                "4️⃣ Verás tus calificaciones por curso\n\n"
            )
            
            logger.info("🔥 ENVIANDO PASOS + BOTÓN DE REDIRECCIÓN - NOTAS")
            return {
                "fulfillmentText": f"[REDIRECT_BUTTON|{intranet_url}|📊 Ver Mis Notas|{mensaje_pasos}]",
            }
        
        # ===================================================================
        # CASO 7: Intent de Consultar Asistencia del Alumno
        # ===================================================================
        if intent_name in ["Consultar Asistencia", "consultar_asistencia", "mi asistencia", "asistencias", "ver mi asistencia", "quiero ver mi asistencia", "ver asistencia"]:
            logger.info("✅ Intent de Consultar Asistencia detectado")
            intranet_url = "https://fronted-php-production.up.railway.app/alumno?section=asistencia"
            
            mensaje_pasos = (
                "✅ **Asistencia:**\n\n"
                "Para consultar tu asistencia desde el intranet:\n\n"
                "1️⃣ Ingresa al portal Net.UPT\n"
                "2️⃣ Haz clic en 'Alumno' en el menú lateral\n"
                "3️⃣ Selecciona 'Asistencia' en las opciones\n"
                "4️⃣ Verás tu registro de asistencia por curso\n\n"
            )
            
            logger.info("🔥 ENVIANDO PASOS + BOTÓN DE REDIRECCIÓN - ASISTENCIA")
            return {
                "fulfillmentText": f"[REDIRECT_BUTTON|{intranet_url}|✅ Ver Mi Asistencia|{mensaje_pasos}]",
            }
        
        # ===================================================================
        # CASO 8: Intent de Problemas Técnicos
        # ===================================================================
        # ===================================================================
        # CASO X: Aula Virtual / Biblioteca Virtual (enlaces externos)
        # ===================================================================
        if intent_name in [
            "Aula Virtual Pregrado", "aula_virtual_pregrado", "aula pregrado", "aulavirtual pregrado",
            "Aula Virtual", "aula_virtual", "aulavirtual"
        ]:
            logger.info("📚 Intent Aula Virtual (Pregrado) detectado")
            url = "https://www.upt.edu.pe/upt/web/index.php"
            
            mensaje = (
                "🎓 **Aula Virtual - Pregrado:**\n\n"
                "Accede a tu aula virtual de pregrado para:\n"
                "• Ver tus cursos matriculados\n"
                "• Revisar materiales de clase\n"
                "• Entregar trabajos y tareas\n"
                "• Participar en foros y actividades\n\n"
            )
            
            response_payload = {
                "fulfillmentText": f"[REDIRECT_BUTTON|{url}|🎓 Ir al Aula Virtual Pregrado|{mensaje}]",
            }
            logger.info(f"🔥 WEBHOOK RETURNING FOR AULA PREGRADO: {response_payload}")
            return response_payload

        if intent_name in [
            "Aula Virtual Postgrado", "aula_virtual_postgrado", "aula postgrado", "aulaespg", "aula_espg"
        ]:
            logger.info("📚 Intent Aula Virtual (Postgrado) detectado")
            url = "https://aulaespg.upt.edu.pe/"
            
            mensaje = (
                "🎓 **Aula Virtual - Postgrado:**\n\n"
                "Accede a tu aula virtual de postgrado para:\n"
                "• Ver tus cursos de especialización\n"
                "• Revisar materiales académicos\n"
                "• Entregar trabajos de investigación\n"
                "• Participar en sesiones virtuales\n\n"
            )
            
            response_payload = {
                "fulfillmentText": f"[REDIRECT_BUTTON|{url}|🎓 Ir al Aula Virtual Postgrado|{mensaje}]",
            }
            logger.info(f"🔥 WEBHOOK RETURNING FOR AULA POSTGRADO: {response_payload}")
            return response_payload

        if intent_name in ["Biblioteca Virtual", "biblioteca", "biblioteca_virtual"]:
            logger.info("📚 Intent Biblioteca Virtual detectado")
            url = "https://biblioteca.upt.edu.pe/net/portada/"
            
            mensaje = (
                "📚 **Biblioteca Virtual:**\n\n"
                "Accede a la biblioteca virtual para:\n"
                "• Buscar libros y revistas digitales\n"
                "• Consultar bases de datos académicas\n"
                "• Descargar recursos bibliográficos\n"
                "• Renovar préstamos de libros\n\n"
            )
            
            response_payload = {
                "fulfillmentText": f"[REDIRECT_BUTTON|{url}|📚 Ir a Biblioteca Virtual|{mensaje}]",
            }
            logger.info(f"🔥 WEBHOOK RETURNING FOR BIBLIOTECA: {response_payload}")
            return response_payload

        # ===================================================================
        # ESCUELAS PROFESIONALES - FACULTAD DE INGENIERÍA
        # ===================================================================
        if intent_name in ["Ingenieria Civil", "ingenieria_civil", "civil", "Ingeniería Civil", "ingenieria civil"]:
            logger.info("🏗️ Intent Ingeniería Civil detectado")
            url = "https://www.upt.edu.pe/upt/web/facultad/index/186"
            return {
                "fulfillmentText": f"🏗️ **Escuela Profesional de Ingeniería Civil**\n\nMás información aquí: {url}\n\n📚 Forma profesionales capaces de diseñar y construir infraestructura civil.\n\n¿Necesitas más información?",
            }

        if intent_name in ["Ingenieria de Sistemas", "ingenieria_sistemas", "sistemas", "Ingeniería de Sistemas", "ingenieria de sistemas", "sistemas e informática", "computación"]:
            logger.info("💻 Intent Ingeniería de Sistemas detectado")
            url = "https://www.upt.edu.pe/upt/web/facultad/index/188"
            return {
                "fulfillmentText": f"💻 **Ingeniería de Sistemas**\n\nMás información:\n{url}",
            }

        if intent_name in ["Ingenieria Electronica", "ingenieria_electronica", "electronica", "Ingeniería Electrónica", "ingenieria electrónica", "electrónica"]:
            logger.info("⚡ Intent Ingeniería Electrónica detectado")
            url = "https://www.upt.edu.pe/upt/web/facultad/index/189"
            return {
                "fulfillmentText": f"⚡ **Escuela Profesional de Ingeniería Electrónica**\n\nMás información aquí: {url}\n\n📚 Forma profesionales en sistemas electrónicos y telecomunicaciones.\n\n¿Necesitas más información?",
            }

        if intent_name in ["Ingenieria Agroindustrial", "ingenieria_agroindustrial", "agroindustrial"]:
            logger.info("🌾 Intent Ingeniería Agroindustrial detectado")
            url = "https://www.upt.edu.pe/upt/web/facultad/index/190"
            return {
                "fulfillmentText": f"🌾 **Escuela Profesional de Ingeniería Agroindustrial**\n\nMás información aquí: {url}\n\n📚 Forma profesionales en procesamiento y transformación de productos agrícolas.\n\n¿Necesitas más información?",
            }

        if intent_name in ["Ingenieria Ambiental", "ingenieria_ambiental", "ambiental"]:
            logger.info("🌍 Intent Ingeniería Ambiental detectado")
            url = "https://www.upt.edu.pe/upt/web/facultad/index/191"
            return {
                "fulfillmentText": f"🌍 **Escuela Profesional de Ingeniería Ambiental**\n\nMás información aquí: {url}\n\n📚 Forma profesionales en gestión ambiental y desarrollo sostenible.\n\n¿Necesitas más información?",
            }

        if intent_name in ["Ingenieria Industrial", "ingenieria_industrial", "industrial"]:
            logger.info("⚙️ Intent Ingeniería Industrial detectado")
            url = "https://www.upt.edu.pe/upt/web/facultad/index/248"
            return {
                "fulfillmentText": f"⚙️ **Escuela Profesional de Ingeniería Industrial**\n\nMás información aquí: {url}\n\n📚 Forma profesionales en optimización de procesos productivos.\n\n¿Necesitas más información?",
            }

        # ===================================================================
        # ESCUELAS PROFESIONALES - FACULTAD DE EDUCACIÓN Y HUMANIDADES
        # ===================================================================
        if intent_name in ["Educacion", "educacion", "ciencias_educacion"]:
            logger.info("📖 Intent Educación detectado")
            url = "https://www.upt.edu.pe/upt/web/facultad/index/170"
            return {
                "fulfillmentText": f"📖 **Escuela Profesional de Educación**\n\nMás información aquí: {url}\n\n📚 Forma profesionales en ciencias de la educación.\n\n¿Necesitas más información?",
            }

        if intent_name in ["Ciencias de la Comunicacion", "comunicacion", "ciencias_comunicacion"]:
            logger.info("📢 Intent Ciencias de la Comunicación detectado")
            url = "https://www.upt.edu.pe/upt/web/facultad/index/176"
            return {
                "fulfillmentText": f"📢 **Escuela Profesional de Ciencias de la Comunicación**\n\nMás información aquí: {url}\n\n📚 Forma profesionales en comunicación social y periodismo.\n\n¿Necesitas más información?",
            }

        if intent_name in ["Psicologia", "psicologia", "humanidades_psicologia"]:
            logger.info("🧠 Intent Psicología detectado")
            url = "https://www.upt.edu.pe/upt/web/facultad/index/178"
            return {
                "fulfillmentText": f"🧠 **Escuela Profesional de Humanidades - Psicología**\n\nMás información aquí: {url}\n\n📚 Forma profesionales en psicología y ciencias del comportamiento.\n\n¿Necesitas más información?",
            }

        # ===================================================================
        # ESCUELAS PROFESIONALES - FACULTAD DE DERECHO
        # ===================================================================
        if intent_name in ["Derecho", "derecho", "ciencias_juridicas"]:
            logger.info("⚖️ Intent Derecho detectado")
            url = "https://www.upt.edu.pe/upt/web/facultad/index/165"
            return {
                "fulfillmentText": f"⚖️ **Escuela Profesional de Derecho**\n\nMás información aquí: {url}\n\n📚 Forma profesionales en ciencias jurídicas y derecho.\n\n¿Necesitas más información?",
            }

        # ===================================================================
        # ESCUELAS PROFESIONALES - FACULTAD DE CIENCIAS DE LA SALUD
        # ===================================================================
        if intent_name in ["Medicina Humana", "medicina", "medicina_humana"]:
            logger.info("🩺 Intent Medicina Humana detectado")
            url = "https://www.upt.edu.pe/upt/web/facultad/index/198"
            return {
                "fulfillmentText": f"🩺 **Escuela Profesional de Medicina Humana**\n\nMás información aquí: {url}\n\n📚 Forma profesionales médicos con sólida formación científica.\n\n¿Necesitas más información?",
            }

        if intent_name in ["Odontologia", "odontologia", "estomatologia"]:
            logger.info("🦷 Intent Odontología detectado")
            url = "https://www.upt.edu.pe/upt/web/facultad/index/199"
            return {
                "fulfillmentText": f"🦷 **Escuela Profesional de Odontología**\n\nMás información aquí: {url}\n\n📚 Forma profesionales en salud bucal y dental.\n\n¿Necesitas más información?",
            }

        if intent_name in ["Tecnologia Medica", "tecnologia_medica", "tec_medica"]:
            logger.info("🔬 Intent Tecnología Médica detectado")
            url = "https://www.upt.edu.pe/upt/web/facultad/index/200"
            return {
                "fulfillmentText": f"🔬 **Escuela Profesional de Tecnología Médica**\n\nMás información aquí: {url}\n\n📚 Forma profesionales en tecnología y laboratorio clínico.\n\n¿Necesitas más información?",
            }

        # ===================================================================
        # ESCUELAS PROFESIONALES - FACULTAD DE CIENCIAS EMPRESARIALES
        # ===================================================================
        if intent_name in ["Contabilidad", "contabilidad", "ciencias_contables"]:
            logger.info("💰 Intent Ciencias Contables detectado")
            url = "https://www.upt.edu.pe/upt/web/facultad/index/218"
            return {
                "fulfillmentText": f"💰 **Escuela Profesional de Ciencias Contables y Financieras**\n\nMás información aquí: {url}\n\n📚 Forma profesionales en contabilidad y finanzas.\n\n¿Necesitas más información?",
            }

        if intent_name in ["Ingenieria Comercial", "ingenieria_comercial", "comercial"]:
            logger.info("📊 Intent Ingeniería Comercial detectado")
            url = "https://www.upt.edu.pe/upt/web/facultad/index/217"
            return {
                "fulfillmentText": f"📊 **Escuela Profesional de Ingeniería Comercial**\n\nMás información aquí: {url}\n\n📚 Forma profesionales en gestión comercial y marketing.\n\n¿Necesitas más información?",
            }

        if intent_name in ["Economia", "economia", "microfinanzas"]:
            logger.info("📈 Intent Economía detectado")
            url = "https://www.upt.edu.pe/upt/web/facultad/index/221"
            return {
                "fulfillmentText": f"📈 **Escuela Profesional de Economía y Microfinanzas**\n\nMás información aquí: {url}\n\n📚 Forma profesionales en economía y finanzas.\n\n¿Necesitas más información?",
            }

        if intent_name in ["Administracion", "administracion", "admin"]:
            logger.info("💼 Intent Administración detectado")
            url = "https://www.upt.edu.pe/upt/web/facultad/index/2828"
            return {
                "fulfillmentText": f"💼 **Escuela Profesional de Administración**\n\nMás información aquí: {url}\n\n📚 Forma profesionales en gestión y administración de empresas.\n\n¿Necesitas más información?",
            }

        if intent_name in ["Turismo", "turismo", "hotelera", "turismo_hotelera"]:
            logger.info("✈️ Intent Turismo y Hotelería detectado")
            url = "https://www.upt.edu.pe/upt/web/facultad/index/216"
            return {
                "fulfillmentText": f"✈️ **Escuela Profesional de Administración Turístico-Hotelera**\n\nMás información aquí: {url}\n\n📚 Forma profesionales en turismo y gestión hotelera.\n\n¿Necesitas más información?",
            }

        if intent_name in ["Negocios Internacionales", "negocios_internacionales", "comercio_internacional"]:
            logger.info("🌐 Intent Negocios Internacionales detectado")
            url = "https://www.upt.edu.pe/upt/web/facultad/index/219"
            return {
                "fulfillmentText": f"🌐 **Escuela Profesional de Administración de Negocios Internacionales**\n\nMás información aquí: {url}\n\n📚 Forma profesionales en comercio exterior y negocios globales.\n\n¿Necesitas más información?",
            }

        if intent_name in ["Problemas Técnicos", "problemas_tecnicos", "technical_issues"]:
            logger.info("🔧 Intent de Problemas Técnicos detectado")
            return {
                "fulfillmentText": "Entiendo que tienes un problema técnico. Para poder ayudarte mejor, necesito que me describas:\n\n• ¿Qué sistema o plataforma estás usando?\n• ¿Qué error específico recibes?\n• ¿Cuándo comenzó el problema?\n\nUn representante revisará tu caso y te contactará pronto.",
            }
        
        # ===================================================================
        # CASO 9: Detectar email sin contexto explícito
        # Si el mensaje contiene un email válido, procesarlo
        # ===================================================================
        email = extract_email_from_text(query_text, parameters)
        if email:
            logger.info(f"✅ Email detectado en mensaje sin contexto: {email}")
            logger.info("📧 Asumiendo que es parte del flujo de recuperación de contraseña")
            return await handle_password_recovery_with_email(email, session)
        
        # ===================================================================
        # CASO 10: Intent por defecto - Cualquier otro mensaje
        # ===================================================================
        logger.warning(f"⚠️ Intent '{intent_name}' no tiene handler específico")
        return {
            "fulfillmentText": "Entiendo que necesitas ayuda. ¿Podrías ser más específico sobre lo que buscas? Puedo ayudarte con:\n\n• 📅 Consultar tu horario\n• 📊 Ver tus notas\n• ✅ Revisar tu asistencia\n• 🔑 Recuperar tu contraseña\n• 📚 Información general\n\n¿Qué necesitas?",
        }
        
    except Exception as e:
        logger.error(f"❌ Error en webhook: {str(e)}", exc_info=True)
        return {
            "fulfillmentText": "Disculpa, ocurrió un error procesando tu solicitud. Por favor intenta nuevamente.",
        }


async def handle_password_recovery_with_email(email_personal: str, session: str) -> Dict[str, Any]:
    """
    Procesa la recuperación de contraseña cuando ya tenemos el email.
    
    Flujo:
    1. Verifica que el email existe en el sistema
    2. Llama al API Gateway para iniciar recuperación
    3. Retorna respuesta apropiada a DialogFlow
    """
    try:
        if not email_personal:
            logger.warning("⚠️ Email vacío")
            return {
                "fulfillmentText": "Por favor proporciona un correo electrónico válido.",
                "outputContexts": [
                    {
                        "name": f"{session}/contexts/awaiting-email",
                        "lifespanCount": 2
                    }
                ]
            }
        
        logger.info(f"🔍 Verificando email personal: {email_personal}")
        
        # ===================================================================
        # PASO 1: Verificar si el email existe
        # ===================================================================
        async with httpx.AsyncClient(timeout=15.0) as client:
            verify_url = f"{API_GATEWAY_BASE_URL}/api/v1/users/verify-email"
            
            logger.debug(f"Llamando a: {verify_url}")
            logger.debug(f"Payload: {{'email': '{email_personal}'}}")
            
            try:
                verify_response = await client.post(
                    verify_url,
                    json={"email": email_personal}  # El endpoint espera "email", no "emailPersonal"
                )
                verify_response.raise_for_status()
                result = verify_response.json()
                logger.debug(f"Respuesta del API Gateway: {result}")
                
            except httpx.HTTPError as e:
                logger.error(f"❌ Error llamando a API Gateway: {str(e)}")
                if hasattr(e, 'response') and e.response:
                    logger.error(f"Response status: {e.response.status_code}")
                    logger.error(f"Response body: {e.response.text}")
                return {
                    "fulfillmentText": "Disculpa, hay un problema técnico. Por favor intenta más tarde o contacta con soporte técnico.",
                }
        
        # ===================================================================
        # PASO 2: Procesar resultado de verificación
        # ===================================================================
        if result.get("exists"):
            # Email encontrado - Procesar datos del API Gateway
            # El API Gateway devuelve: {exists, user_id, name}
            usuario = result.get("user_id", "")
            nombre_completo = result.get("name", "Usuario")
            
            logger.info(f"✅ Email encontrado - Usuario: {usuario} ({nombre_completo})")
            
            # ===================================================================
            # PASO 3: Iniciar proceso de recuperación
            # ===================================================================
            try:
                # Extraer session_id del campo session de DialogFlow
                # Formato: "projects/PROJECT_ID/agent/sessions/SESSION_ID"
                session_id = session.split("/")[-1] if session else "unknown"
                
                async with httpx.AsyncClient(timeout=20.0) as client:
                    initiate_url = f"{API_GATEWAY_BASE_URL}/api/v1/password-reset/initiate"
                    
                    payload = {
                        "email": email_personal,
                        "session_id": session_id
                    }
                    
                    logger.info(f"🚀 Iniciando recuperación de contraseña...")
                    logger.debug(f"URL: {initiate_url}")
                    logger.debug(f"Payload: {payload}")
                    
                    initiate_response = await client.post(
                        initiate_url,
                        json=payload
                    )
                    initiate_response.raise_for_status()
                    initiate_result = initiate_response.json()
                
                if initiate_result.get("success"):
                    logger.info(f"✅ Proceso de recuperación iniciado exitosamente")
                    
                    # Respuesta exitosa para DialogFlow
                    return {
                        "fulfillmentText": (
                            f"Perfecto, {nombre_completo}. "
                            f"He enviado un correo electrónico a {email_personal} con las instrucciones "
                            f"para recuperar tu contraseña. "
                            f"Por favor revisa tu bandeja de entrada y sigue los pasos indicados. "
                            f"Si no recibes el correo en unos minutos, revisa tu carpeta de spam o contacta con soporte."
                        ),
                    }
                else:
                    logger.error(f"❌ Error al iniciar recuperación: {initiate_result.get('message')}")
                    return {
                        "fulfillmentText": (
                            "Hubo un problema al procesar tu solicitud de recuperación de contraseña. "
                            "Por favor intenta nuevamente más tarde o contacta con soporte técnico."
                        ),
                    }
                    
            except httpx.HTTPError as e:
                logger.error(f"❌ Error al iniciar recuperación: {str(e)}")
                return {
                    "fulfillmentText": (
                        "Hubo un problema técnico al enviar el correo de recuperación. "
                        "Por favor intenta nuevamente en unos minutos."
                    ),
                }
        
        else:
            # Email NO encontrado - Dar otra oportunidad
            logger.warning(f"❌ Email no encontrado: {email_personal}")
            return {
                "fulfillmentText": (
                    f"Lo siento, el correo electrónico {email_personal} no está registrado en nuestro sistema. "
                    f"¿Quieres intentar con otro correo? Si crees que es un error, contacta con la oficina de "
                    f"registros académicos."
                ),
                "outputContexts": [
                    {
                        "name": f"{session}/contexts/awaiting-email",
                        "lifespanCount": 2  # Dar 2 intentos más
                    }
                ]
            }
    
    except Exception as e:
        logger.error(f"❌ Error en handle_password_recovery_with_email: {str(e)}", exc_info=True)
        return {
            "fulfillmentText": "Disculpa, ocurrió un error al procesar tu solicitud. Por favor intenta nuevamente.",
        }


# Endpoint adicional para testing
@router.get("/webhook/health")
async def webhook_health():
    """Health check del webhook"""
    return {
        "status": "healthy",
        "service": "nlp-service-webhook",
        "api_gateway_url": API_GATEWAY_BASE_URL
    }
