"""
DialogFlow Service - Infrastructure Layer
Servicio para integración con Google DialogFlow.
"""
import os
from typing import Optional, Dict, Any, List
from google.cloud import dialogflow
from google.oauth2 import service_account
import json

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
            if not os.path.exists(self.credentials_path):
                raise FileNotFoundError(f"Credentials file not found: {self.credentials_path}")
            
            # Cargar credenciales del service account
            self.credentials = service_account.Credentials.from_service_account_file(
                self.credentials_path,
                scopes=['https://www.googleapis.com/auth/cloud-platform']
            )
            
            logger.info(f"✅ DialogFlow credentials loaded from {self.credentials_path}")
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize DialogFlow client: {str(e)}")
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
            
            # Crear text input
            text_input = dialogflow.TextInput(
                text=message.normalized_text,
                language_code=self.language_code
            )
            
            # Crear query input
            query_input = dialogflow.QueryInput(text=text_input)
            
            # Hacer la petición a DialogFlow
            response = self.session_client.detect_intent(
                request={
                    "session": session_path,
                    "query_input": query_input
                }
            )
            
            # Procesar respuesta
            result = self._process_dialogflow_response(response)
            
            logger.info(f"DialogFlow intent detected: {result.get('intent_name')} "
                       f"(confidence: {result.get('confidence')})")
            
            return result
            
        except Exception as e:
            logger.error(f"❌ DialogFlow intent detection failed: {str(e)}")
            raise
    
    def _process_dialogflow_response(self, response) -> Dict[str, Any]:
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
        
        return {
            "query_text": query_result.query_text,
            "intent_name": query_result.intent.display_name if query_result.intent.display_name else "Default Fallback Intent",
            "intent_id": query_result.intent.name,
            "confidence": query_result.intent_detection_confidence,
            "fulfillment_text": query_result.fulfillment_text,  # DialogFlow convierte camelCase a snake_case
            "fulfillmentText": query_result.fulfillment_text,    # También en formato original
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