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
        # CASO 3: Detectar email sin contexto explícito
        # Si el mensaje contiene un email válido, procesarlo
        # ===================================================================
        email = extract_email_from_text(query_text, parameters)
        if email:
            logger.info(f"✅ Email detectado en mensaje sin contexto: {email}")
            logger.info("📧 Asumiendo que es parte del flujo de recuperación de contraseña")
            return await handle_password_recovery_with_email(email, session)
        
        # ===================================================================
        # CASO 4: Intent por defecto - Cualquier otro mensaje
        # ===================================================================
        logger.warning(f"⚠️ Intent '{intent_name}' no tiene handler específico")
        return {
            "fulfillmentText": "Procesando tu solicitud...",
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
