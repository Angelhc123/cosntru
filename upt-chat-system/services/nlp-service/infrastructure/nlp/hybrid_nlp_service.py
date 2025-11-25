"""
Hybrid NLP Service - Infrastructure Layer
Servicio híbrido que usa DialogFlow como primario y NLP local como fallback.
"""
from typing import Dict, Any, Optional
import asyncio

from infrastructure.nlp.dialogflow_service import DialogFlowService
from infrastructure.nlp.nlp_engine import NLPEngine
from domain.value_objects.message import Message
from domain.value_objects.confidence import Confidence
from infrastructure.logging.logger_config import logger


class HybridNLPService:
    """
    Servicio NLP híbrido:
    1. Intenta usar DialogFlow primero
    2. Si falla o no está disponible, usa NLP local
    """
    
    def __init__(
        self,
        dialogflow_service: Optional[DialogFlowService] = None,
        nlp_engine: Optional[NLPEngine] = None,
        use_dialogflow: bool = True
    ):
        """
        Inicializa el servicio híbrido
        
        Args:
            dialogflow_service: Instancia del servicio DialogFlow
            nlp_engine: Motor NLP local
            use_dialogflow: Si usar DialogFlow como primario
        """
        self.dialogflow_service = dialogflow_service
        self.nlp_engine = nlp_engine
        self.use_dialogflow = use_dialogflow
        
        # Verificar disponibilidad
        self.dialogflow_available = (
            dialogflow_service and 
            dialogflow_service.is_available() if dialogflow_service else False
        )
        
        self.local_nlp_available = nlp_engine is not None
        
        logger.info(f"🤖 Hybrid NLP Service initialized:")
        logger.info(f"   DialogFlow: {'✅ Available' if self.dialogflow_available else '❌ Not available'}")
        logger.info(f"   Local NLP: {'✅ Available' if self.local_nlp_available else '❌ Not available'}")
        logger.info(f"   Primary: {'DialogFlow' if use_dialogflow else 'Local NLP'}")
    
    async def detect_intent(
        self,
        session_id: str,
        message: Message
    ) -> Dict[str, Any]:
        """
        Detecta intención usando el método híbrido
        
        Args:
            session_id: ID de sesión
            message: Mensaje del usuario
            
        Returns:
            Resultado de detección de intención
        """
        result = None
        method_used = "unknown"
        
        # Estrategia 1: Intentar DialogFlow primero (si está habilitado y disponible)
        logger.info(f"🔍 HYBRID SERVICE ANALYSIS:")
        logger.info(f"   - use_dialogflow: {self.use_dialogflow}")
        logger.info(f"   - dialogflow_available: {self.dialogflow_available}")
        logger.info(f"   - local_nlp_available: {self.local_nlp_available}")
        logger.info(f"   - dialogflow_service exists: {self.dialogflow_service is not None}")
        
        if self.use_dialogflow and self.dialogflow_available:
            try:
                logger.info(f"🤖 TRYING DIALOGFLOW for: '{message.normalized_text[:50]}...'")
                result = await self.dialogflow_service.detect_intent(session_id, message)
                method_used = "dialogflow"
                
                # Verificar confianza
                confidence = result.get('confidence', 0.0)
                logger.info(f"🤖 DIALOGFLOW RESPONSE: intent='{result.get('intent_name')}', confidence={confidence:.3f}")
                
                if confidence >= 0.3:  # Umbral mínimo para DialogFlow (bajado para aceptar más intents)
                    result['method_used'] = method_used
                    result['hybrid_confidence'] = confidence
                    logger.info(f"✅ DIALOGFLOW SUCCESS: Using {result['intent_name']} with confidence {confidence:.2f}")
                    return result
                else:
                    logger.warning(f"⚠️ DIALOGFLOW LOW CONFIDENCE ({confidence:.2f}), switching to local NLP...")
                    result = None  # Resetear para intentar local
                    
            except Exception as e:
                logger.error(f"❌ DIALOGFLOW FAILED: {str(e)}")
                logger.error(f"❌ Exception type: {type(e).__name__}")
                logger.warning(f"⚠️ Falling back to local NLP...")
                result = None
        else:
            logger.info(f"🔄 SKIPPING DIALOGFLOW - use_dialogflow: {self.use_dialogflow}, available: {self.dialogflow_available}")
        
        # Estrategia 2: Usar NLP local (como fallback o primario)
        if result is None and self.local_nlp_available:
            try:
                logger.info(f"🧠 TRYING LOCAL NLP for: '{message.normalized_text[:50]}...'")
                result = await self._detect_intent_local(session_id, message)
                method_used = "local_nlp"
                
                result['method_used'] = method_used
                logger.info(f"✅ LOCAL NLP SUCCESS: {result['intent_name']} ({result['confidence']:.2f})")
                return result
                
            except Exception as e:
                logger.error(f"❌ LOCAL NLP ALSO FAILED: {str(e)}")
        elif result is None:
            logger.error(f"❌ NO NLP METHODS AVAILABLE - DialogFlow: {self.dialogflow_available}, Local: {self.local_nlp_available}")
        
        # Si todo falla, devolver respuesta por defecto
        logger.warning(f"🔄 USING FALLBACK RESPONSE")
        return self._get_fallback_response(message, session_id)
    
    async def _detect_intent_local(
        self,
        session_id: str,
        message: Message
    ) -> Dict[str, Any]:
        """
        Detecta intención usando NLP local
        
        Args:
            session_id: ID de sesión
            message: Mensaje del usuario
            
        Returns:
            Resultado en formato similar a DialogFlow
        """
        # Aquí integrarías con tu motor NLP local existente
        # Por ahora, simulamos el procesamiento
        
        # Extraer texto del mensaje (puede ser Message object o string)
        message_text = message.content if hasattr(message, 'content') else str(message)
        
        normalized_text = self.nlp_engine.normalize_text(message_text)
        keywords = self.nlp_engine.extract_keywords(message_text)
        
        # Lógica simplificada de detección de intención
        intent_name = self._classify_intent(normalized_text, keywords)
        confidence = self._calculate_confidence(normalized_text, intent_name)
        
        return {
            "query_text": message_text,
            "intent_name": intent_name,
            "intent_id": f"local_{intent_name.lower().replace(' ', '_')}",
            "confidence": confidence,
            "fulfillment_text": self._get_fulfillment_text(intent_name),
            "parameters": self._extract_parameters(normalized_text, keywords),
            "action": f"input.{intent_name.lower().replace(' ', '_')}",
            "contexts": [],
            "session_id": session_id,
            "response_id": f"local_{session_id}_{hash(message_text)}",
            "keywords": keywords,
            "normalized_text": normalized_text
        }
    
    def _classify_intent(self, text: str, keywords: list) -> str:
        """
        Clasifica la intención basado en palabras clave
        """
        # Mapeo simple de palabras clave a intenciones
        intent_keywords = {
            "matricula": ["matricula", "inscripcion", "inscribir", "registrar"],
            "notas": ["nota", "calificacion", "promedio", "examen"],
            "horarios": ["horario", "clase", "aula", "salon"],
            "pagos": ["pago", "pension", "cuota", "mensualidad"],
            "biblioteca": ["biblioteca", "libro", "prestamo"],
            "tramites": ["tramite", "documento", "certificado", "constancia"],
            "contacto": ["contacto", "telefono", "direccion", "ubicacion"],
            "campus_virtual": ["campus", "virtual", "plataforma", "login", "acceso"],
            "default": []
        }
        
        text_lower = text.lower()
        keyword_lower = [k.lower() for k in keywords]
        
        for intent, intent_keys in intent_keywords.items():
            if intent == "default":
                continue
                
            for key in intent_keys:
                if key in text_lower or key in keyword_lower:
                    return intent
        
        return "consulta_general"
    
    def _calculate_confidence(self, text: str, intent_name: str) -> float:
        """
        Calcula confianza basado en la longitud y claridad del texto
        """
        base_confidence = 0.6
        
        # Aumentar confianza si hay palabras clave específicas
        if len(text.split()) >= 3:
            base_confidence += 0.1
        
        if intent_name != "consulta_general":
            base_confidence += 0.2
        
        return min(base_confidence, 0.95)  # Máximo 95% para NLP local
    
    def _extract_parameters(self, text: str, keywords: list) -> Dict[str, Any]:
        """
        Extrae parámetros del texto
        """
        return {
            "keywords": keywords,
            "text_length": len(text),
            "word_count": len(text.split())
        }
    
    def _get_fulfillment_text(self, intent_name: str) -> str:
        """
        Obtiene texto de respuesta por defecto
        NOTA: Estos son fallbacks cuando DialogFlow no responde
        """
        responses = {
            "matricula": "Te puedo ayudar con información sobre matrícula. ¿Qué específicamente necesitas saber? [RESPUESTA DADA POR PYTHON]",
            "pagos": "Información sobre pagos y pensiones está disponible en tesorería. [RESPUESTA DADA POR PYTHON]",
            "biblioteca": "La biblioteca ofrece varios servicios. ¿Qué necesitas? [RESPUESTA DADA POR PYTHON]",
            "tramites": "Hay varios trámites disponibles. ¿Cuál necesitas realizar? [RESPUESTA DADA POR PYTHON]",
            "contacto": "Puedo proporcionarte información de contacto de diferentes áreas. [RESPUESTA DADA POR PYTHON]",
            "campus_virtual": "Para acceder al campus virtual necesitas tus credenciales UPT. [RESPUESTA DADA POR PYTHON]",
            "consulta_general": "Entiendo que necesitas ayuda. ¿Podrías ser más específico sobre lo que buscas? [RESPUESTA DADA POR PYTHON]"
        }
        
        return responses.get(intent_name, "Te puedo ayudar. ¿Podrías darme más detalles? [RESPUESTA DADA POR PYTHON]")
    
    def _get_fallback_response(
        self,
        message: Message,
        session_id: str
    ) -> Dict[str, Any]:
        """
        Respuesta por defecto cuando todos los métodos fallan
        """
        # Extraer texto del mensaje (puede ser Message object o string)
        message_text = message.content if hasattr(message, 'content') else str(message)
        logger.error(f"❌ All NLP methods failed for message: {message_text}")
        
        return {
            "query_text": message_text,
            "intent_name": "system_fallback",
            "intent_id": "system_fallback",
            "confidence": 0.1,
            "fulfillment_text": (
                "Lo siento, en este momento tengo dificultades para procesar tu consulta. "
                "¿Podrías reformular tu pregunta o contactar directamente con soporte técnico? [RESPUESTA DADA POR PYTHON]"
            ),
            "parameters": {},
            "action": "input.unknown",
            "contexts": [],
            "session_id": session_id,
            "response_id": f"fallback_{session_id}",
            "method_used": "fallback",
            "hybrid_confidence": 0.1,
            "error": "All NLP methods failed"
        }
    
    async def get_fallback_response(self) -> str:
        """
        Devuelve una respuesta de fallback cuando no se puede procesar el mensaje
        """
        return (
            "Lo siento, no pude entender tu pregunta. "
            "¿Podrías reformularla de otra manera? "
            "También puedes contactar directamente con soporte técnico."
        )
    
    def get_status(self) -> Dict[str, Any]:
        """
        Obtiene el estado del servicio híbrido
        """
        return {
            "dialogflow_available": self.dialogflow_available,
            "local_nlp_available": self.local_nlp_available,
            "use_dialogflow": self.use_dialogflow,
            "primary_method": "DialogFlow" if self.use_dialogflow and self.dialogflow_available else "Local NLP",
            "fallback_method": "Local NLP" if self.dialogflow_available else "Basic Patterns"
        }