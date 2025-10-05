"""
Detect Intent Use Case - Application Layer
Caso de uso para detectar solo el intent sin generar respuesta completa.
"""
from typing import Optional
from domain.services.nlp_domain_service import NLPDomainService
from domain.value_objects.message import Message
from application.dtos.process_request_dto import DetectIntentRequestDTO
from application.dtos.nlp_response_dto import DetectIntentResponseDTO, IntentDTO


class DetectIntentUseCase:
    """
    Use Case para detectar el intent de un mensaje
    
    Útil para:
    - Testing y debugging
    - Análisis de mensajes sin generar respuesta
    - Métricas de detección de intents
    """
    
    def __init__(self, nlp_service: NLPDomainService):
        self.nlp_service = nlp_service
    
    async def execute(self, request: DetectIntentRequestDTO) -> DetectIntentResponseDTO:
        """
        Detecta el intent de un mensaje
        """
        # Crear Message VO
        message = Message(request.message)
        
        # Detectar intent
        intent_result = await self.nlp_service.detect_intent(message)
        
        # Construir respuesta
        intent_dto: Optional[IntentDTO] = None
        confidence = intent_result.confidence.value
        
        if intent_result.is_detected():
            intent = intent_result.intent
            intent_dto = IntentDTO(
                id=intent.id,
                name=intent.name,
                category=intent.category,
                confidence=confidence,
                matched_keywords=intent_result.matched_keywords
            )
            message_text = f"Intent detectado: {intent.name}"
        else:
            message_text = "No se pudo detectar un intent con suficiente confianza"
        
        return DetectIntentResponseDTO(
            intent=intent_dto,
            confidence=confidence,
            message=message_text
        )
