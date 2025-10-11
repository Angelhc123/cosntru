"""
DialogFlow ES Service (Free Version)
Integración con DialogFlow ES que no requiere Google Cloud Project.
"""
import requests
import json
from typing import Dict, Any, Optional
from infrastructure.logging.logger_config import logger


class DialogFlowESService:
    """
    Servicio para DialogFlow ES (versión gratuita)
    No requiere Google Cloud Project
    """
    
    def __init__(
        self,
        access_token: str,
        session_id: str = "default-session",
        language_code: str = "es"
    ):
        """
        Inicializa DialogFlow ES
        
        Args:
            access_token: Token de acceso de DialogFlow ES
            session_id: ID de sesión por defecto
            language_code: Código de idioma
        """
        self.access_token = access_token
        self.session_id = session_id
        self.language_code = language_code
        self.base_url = "https://api.dialogflow.com/v1"
        
        logger.info("✅ DialogFlow ES Service initialized (FREE)")
    
    async def detect_intent(self, message: str, session_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Detecta intención usando DialogFlow ES API
        
        Args:
            message: Mensaje del usuario
            session_id: ID de sesión (opcional)
            
        Returns:
            Respuesta de DialogFlow ES
        """
        try:
            url = f"{self.base_url}/query"
            
            headers = {
                "Authorization": f"Bearer {self.access_token}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "query": message,
                "lang": self.language_code,
                "sessionId": session_id or self.session_id,
                "contexts": []
            }
            
            response = requests.post(url, headers=headers, json=payload)
            response.raise_for_status()
            
            data = response.json()
            
            # Procesar respuesta
            result = self._process_es_response(data)
            
            logger.info(f"DialogFlow ES success: {result.get('intent')} ({result.get('score')})")
            return result
            
        except Exception as e:
            logger.error(f"❌ DialogFlow ES failed: {str(e)}")
            raise
    
    def _process_es_response(self, response: Dict[str, Any]) -> Dict[str, Any]:
        """
        Procesa respuesta de DialogFlow ES
        """
        result = response.get("result", {})
        
        return {
            "query_text": result.get("resolvedQuery", ""),
            "intent_name": result.get("metadata", {}).get("intentName", "Default Fallback Intent"),
            "intent": result.get("action", ""),
            "confidence": result.get("score", 0.0),
            "fulfillment_text": result.get("fulfillment", {}).get("speech", ""),
            "parameters": result.get("parameters", {}),
            "contexts": result.get("contexts", []),
            "session_id": self.session_id,
            "source": "dialogflow_es"
        }
    
    def is_available(self) -> bool:
        """
        Verifica disponibilidad de DialogFlow ES
        """
        try:
            url = f"{self.base_url}/query"
            headers = {"Authorization": f"Bearer {self.access_token}"}
            
            # Test query simple
            payload = {
                "query": "test",
                "lang": self.language_code,
                "sessionId": "test"
            }
            
            response = requests.post(url, headers=headers, json=payload, timeout=5)
            return response.status_code == 200
            
        except:
            return False