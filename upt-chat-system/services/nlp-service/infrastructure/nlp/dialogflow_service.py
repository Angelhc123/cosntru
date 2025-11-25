"""
DialogFlow Service - Infrastructure Layer
Servicio para integración con Google DialogFlow.
"""
import os
from typing import Optional, Dict, Any, List
from google.cloud import dialogflow
from google.oauth2 import service_account
import json
import httpx
import asyncio
from datetime import datetime

from domain.entities.intent import Intent
from domain.value_objects.confidence import Confidence
from domain.value_objects.message import Message
from infrastructure.logging.logger_config import logger


class DialogFlowService:
    """
    Servicio para interactuar con Google DialogFlow
    """
    
    def __init__(
        self,
        project_id: str,
        credentials_path: str,
        language_code: str = "es"
    ):
        """
        Inicializa el servicio DialogFlow
        
        Args:
            project_id: ID del proyecto en Google Cloud
            credentials_path: Ruta al archivo de credenciales JSON
            language_code: Código de idioma (español por defecto)
        """
        self.project_id = project_id
        self.language_code = language_code
        self.credentials_path = credentials_path
        
        # Inicializar cliente
        self._initialize_client()
        
        # Configurar session path template
        self.session_client = dialogflow.SessionsClient(credentials=self.credentials)
        self.session_path_template = f"projects/{project_id}/agent/sessions/{{}}"
    
    def _initialize_client(self):
        """
        Inicializa el cliente DialogFlow con credenciales
        """
        try:
            logger.info(f"🔍 INITIALIZING DIALOGFLOW CLIENT:")
            logger.info(f"   - Project ID: {self.project_id}")
            logger.info(f"   - Credentials path: {self.credentials_path}")
            logger.info(f"   - Language code: {self.language_code}")
            
            if not os.path.exists(self.credentials_path):
                logger.error(f"❌ Credentials file not found: {self.credentials_path}")
                raise FileNotFoundError(f"Credentials file not found: {self.credentials_path}")
            
            # Verificar tamaño del archivo
            file_size = os.path.getsize(self.credentials_path)
            logger.info(f"🔍 Credentials file size: {file_size} bytes")
            
            # Cargar credenciales del service account
            logger.info(f"🔄 Loading service account credentials...")
            self.credentials = service_account.Credentials.from_service_account_file(
                self.credentials_path,
                scopes=['https://www.googleapis.com/auth/cloud-platform']
            )
            
            logger.info(f"✅ DialogFlow credentials loaded successfully from {self.credentials_path}")
            logger.info(f"✅ Service account email: {self.credentials.service_account_email}")
            
        except Exception as e:
            logger.error(f"❌ DIALOGFLOW CLIENT INITIALIZATION FAILED: {str(e)}")
            logger.error(f"❌ Exception type: {type(e).__name__}")
            import traceback
            logger.error(f"❌ Full traceback: {traceback.format_exc()}")
            raise
    
    async def detect_intent(
        self,
        session_id: str,
        message: Message
    ) -> Dict[str, Any]:
        """
        Detecta la intención usando DialogFlow
        
        Args:
            session_id: ID único de la sesión de conversación
            message: Mensaje del usuario
            
        Returns:
            Diccionario con la respuesta de DialogFlow
        """
        try:
            # Crear session path
            session_path = self.session_path_template.format(session_id)
            logger.info(f"🔍 DIALOGFLOW REQUEST:")
            logger.info(f"   - Session ID: {session_id}")
            logger.info(f"   - Session Path: {session_path}")
            logger.info(f"   - Text: '{message.normalized_text}'")
            logger.info(f"   - Language: {self.language_code}")
            logger.info(f"   - Project ID: {self.project_id}")
            
            # Crear text input
            text_input = dialogflow.TextInput(
                text=message.normalized_text,
                language_code=self.language_code
            )
            
            # Crear query input
            query_input = dialogflow.QueryInput(text=text_input)
            
            # Hacer la petición a DialogFlow
            logger.info(f"🔄 Making request to DialogFlow...")
            response = self.session_client.detect_intent(
                request={
                    "session": session_path,
                    "query_input": query_input
                }
            )
            logger.info(f"✅ DialogFlow request successful")
            
            # Procesar respuesta
            result = await self._process_dialogflow_response(response)
            
            logger.info(f"📋 DIALOGFLOW RESULT:")
            logger.info(f"   - Intent: {result.get('intent_name')}")
            logger.info(f"   - Confidence: {result.get('confidence'):.3f}")
            logger.info(f"   - Fulfillment: '{result.get('fulfillment_text', '')[:100]}...'")
            logger.info(f"   - Action: {result.get('action')}")
            
            return result
            
        except Exception as e:
            logger.error(f"❌ DIALOGFLOW ERROR: {str(e)}")
            logger.error(f"❌ Exception type: {type(e).__name__}")
            import traceback
            logger.error(f"❌ Full traceback: {traceback.format_exc()}")
            raise
    
    async def _process_dialogflow_response(self, response) -> Dict[str, Any]:
        """
        Procesa la respuesta de DialogFlow
        
        Args:
            response: Respuesta de DialogFlow
            
        Returns:
            Diccionario con datos procesados
        """
        query_result = response.query_result
        
        # Procesar output contexts (incluye los del webhook)
        output_contexts = []
        for context in query_result.output_contexts:
            output_contexts.append({
                "name": context.name,
                "lifespanCount": context.lifespan_count,
                "parameters": dict(context.parameters)
            })
        
        # IMPORTANT: Respuestas hardcoded para todos los intents hasta que se arregle el webhook
        webhook_response_text = query_result.fulfillment_text
        logger.info(f"🔍 WEBHOOK RESPONSE FROM QUERY_RESULT.FULFILLMENT_TEXT: '{webhook_response_text}'")
        
        # TEMPORAL FIX: Respuestas hardcoded para todos los intents
        intent_name = query_result.intent.display_name if query_result.intent.display_name else "Default Fallback Intent"
        
        # Diccionario de respuestas por intent con información de escalación
        intent_config = {
            "Saludos": {
                "response": "¡Hola! Soy el Asistente Virtual de la UPT. ¿En qué puedo ayudarte hoy? Puedo asistirte con:\n\n• Recuperación de contraseña\n• Consultar horario\n• Ver notas\n• Revisar asistencia\n\n¿Qué necesitas?",
                "escalate": False
            },
            "Contraseña Institucional": {
                "response": "Los problemas de acceso institucional requieren soporte especializado. Nuestro sistema detectó que necesitas ayuda personalizada.",
                "escalate": True,
                "category": "Contraseña Institucional"
            },
            "Consultar Horario": {
                "response": "[REDIRECT_BUTTON|https://fronted-php-production.up.railway.app/alumno?section=horario|📅 Ver Mi Horario|📅 **Horarios:**\n\nPara consultar tu horario desde el intranet:\n\n1️⃣ Ingresa al portal Net.UPT\n2️⃣ Haz clic en 'Alumno' en el menú lateral\n3️⃣ Selecciona 'Horario' en las opciones\n4️⃣ Verás tu horario completo del ciclo actual\n\n]",
                "escalate": False
            },
            "Consultar Notas": {
                "response": "[REDIRECT_BUTTON|https://fronted-php-production.up.railway.app/alumno?section=notas|📊 Ver Mis Notas|📊 **Notas:**\n\nPara consultar tus notas desde el intranet:\n\n1️⃣ Ingresa al portal Net.UPT\n2️⃣ Haz clic en 'Alumno' en el menú lateral\n3️⃣ Selecciona 'Notas' en las opciones\n4️⃣ Verás tus calificaciones por curso\n\n]",
                "escalate": False
            },
            "Consultar Asistencia": {
                "response": "[REDIRECT_BUTTON|https://fronted-php-production.up.railway.app/alumno?section=asistencia|✅ Ver Mi Asistencia|✅ **Asistencia:**\n\nPara consultar tu asistencia desde el intranet:\n\n1️⃣ Ingresa al portal Net.UPT\n2️⃣ Haz clic en 'Alumno' en el menú lateral\n3️⃣ Selecciona 'Asistencia' en las opciones\n4️⃣ Verás tu registro de asistencia por curso\n\n]",
                "escalate": False
            },
            "Información de Matrícula": {
                "response": "Para información sobre matrícula, te puedo ayudar con:\n\n📚 **Fechas de matrícula**\n📚 **Requisitos necesarios**\n📚 **Proceso de inscripción**\n📚 **Costos y pagos**\n\n¿Qué información específica necesitas sobre la matrícula?",
                "escalate": False
            },
            "Problemas Técnicos": {
                "response": "Lamento que tengas problemas técnicos. Ahora te atenderá un especialista.",
                "escalate": True,
                "category": "Problemas Técnicos"
            }
        }
        
        # PRIORIDAD 1: Si hay fulfillment messages del webhook, usar esa respuesta
        if query_result.fulfillment_messages:
            for message in query_result.fulfillment_messages:
                if hasattr(message, 'text') and message.text and message.text.text:
                    webhook_response_text = message.text.text[0]
                    logger.info(f"✅ Webhook response extracted from fulfillment_messages")
                    break
        
        # PRIORIDAD 2: Si el webhook no devolvió nada, usar respuestas hardcoded
        if (not webhook_response_text or webhook_response_text.strip() == '') and intent_name in intent_config:
            config = intent_config[intent_name]
            webhook_response_text = config["response"]
            
            # Marcar si el intent requiere escalación (el API Gateway se encarga de crear el ticket)
            if config.get("escalate", False):
                logger.info(f"🎫 INTENT REQUIRES ESCALATION: {intent_name} - API Gateway will handle ticket creation")
            
            logger.info(f"🔧 TEMPORAL FIX: Using configured response for {intent_name} intent")
        
        logger.info(f"📋 FINAL RESPONSE: intent='{intent_name}', text='{webhook_response_text[:500]}...'")
        
        # Log de debugging - MOSTRAR TEXTO COMPLETO
        logger.info(f"📋 DIALOGFLOW RESULT:")
        logger.info(f"   - Intent: {query_result.intent.display_name if query_result.intent.display_name else 'Default Fallback Intent'}")
        logger.info(f"   - Confidence: {query_result.intent_detection_confidence:.3f}")
        logger.info(f"   - Fulfillment COMPLETO: '{webhook_response_text}'")  # SIN TRUNCAR
        logger.info(f"   - Action: {query_result.action}")
        logger.info(f"📋 Parámetros: {dict(query_result.parameters)}")
        logger.info(f"🔄 Contexts: {[c.name.split('/')[-1] for c in query_result.output_contexts]}")

        return {
            "query_text": query_result.query_text,
            "intent_name": query_result.intent.display_name if query_result.intent.display_name else "Default Fallback Intent",
            "intent_id": query_result.intent.name,
            "confidence": query_result.intent_detection_confidence,
            "fulfillment_text": webhook_response_text,  # Respuesta correcta del webhook
            "fulfillmentText": webhook_response_text,    # También en formato camelCase
            "parameters": dict(query_result.parameters),
            "action": query_result.action,
            "contexts": output_contexts,  # Formato antiguo (mantener compatibilidad)
            "outputContexts": output_contexts,  # Formato nuevo (webhook)
            "response_id": response.response_id
        }
    
    async def create_intent(
        self,
        intent_name: str,
        training_phrases: List[str],
        response: str,
        parameters: Optional[List[Dict[str, Any]]] = None
    ) -> bool:
        """
        Crea un nuevo intent en DialogFlow
        
        Args:
            intent_name: Nombre del intent
            training_phrases: Frases de entrenamiento
            response: Respuesta automática
            parameters: Parámetros del intent (opcional)
            
        Returns:
            True si se creó exitosamente
        """
        try:
            intents_client = dialogflow.IntentsClient(credentials=self.credentials)
            parent = f"projects/{self.project_id}/agent"
            
            # Crear training phrases
            training_phrases_list = []
            for phrase in training_phrases:
                parts = [dialogflow.Intent.TrainingPhrase.Part(text=phrase)]
                training_phrase = dialogflow.Intent.TrainingPhrase(parts=parts)
                training_phrases_list.append(training_phrase)
            
            # Crear mensaje de respuesta
            text = dialogflow.Intent.Message.Text(text=[response])
            message = dialogflow.Intent.Message(text=text)
            
            # Crear intent
            intent = dialogflow.Intent(
                display_name=intent_name,
                training_phrases=training_phrases_list,
                messages=[message]
            )
            
            # Crear en DialogFlow
            response = intents_client.create_intent(
                request={"parent": parent, "intent": intent}
            )
            
            logger.info(f"✅ Intent created: {intent_name}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to create intent {intent_name}: {str(e)}")
            return False
    
    async def list_intents(self) -> List[Dict[str, Any]]:
        """
        Lista todos los intents del agente DialogFlow
        
        Returns:
            Lista de intents con sus datos
        """
        try:
            intents_client = dialogflow.IntentsClient(credentials=self.credentials)
            parent = f"projects/{self.project_id}/agent"
            
            intents = intents_client.list_intents(request={"parent": parent})
            
            result = []
            for intent in intents:
                result.append({
                    "name": intent.name,
                    "display_name": intent.display_name,
                    "training_phrases_count": len(intent.training_phrases),
                    "messages_count": len(intent.messages)
                })
            
            logger.info(f"📋 Retrieved {len(result)} intents from DialogFlow")
            return result
            
        except Exception as e:
            logger.error(f"❌ Failed to list intents: {str(e)}")
            return []
    
    async def train_agent(self) -> bool:
        """
        Entrena el agente DialogFlow
        
        Returns:
            True si el entrenamiento fue exitoso
        """
        try:
            agents_client = dialogflow.AgentsClient(credentials=self.credentials)
            parent = f"projects/{self.project_id}"
            
            operation = agents_client.train_agent(request={"parent": parent})
            
            logger.info("🧠 DialogFlow agent training started...")
            
            # Nota: El entrenamiento es asíncrono
            # Para producción, implementar polling del operation.done()
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to train agent: {str(e)}")
            return False
    
    def is_available(self) -> bool:
        """
        Verifica si DialogFlow está disponible y configurado
        
        Returns:
            True si está disponible
        """
        try:
            return (
                os.path.exists(self.credentials_path) and
                self.project_id and 
                self.credentials is not None
            )
        except:
            return False
    
