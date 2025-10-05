"""
Process Message Use Case - Application Layer
Caso de uso principal para procesar mensajes del usuario.
"""
from typing import Optional
from domain.services.nlp_domain_service import NLPDomainService, IntentDetectionResult
from domain.services.context_manager_service import ContextManagerService
from domain.value_objects.message import Message
from domain.value_objects.confidence import ConfidenceLevel
from application.dtos.process_request_dto import ProcessMessageRequestDTO
from application.dtos.nlp_response_dto import (
    ProcessMessageResponseDTO,
    IntentDTO,
    FAQDTO
)


class ProcessMessageUseCase:
    """
    Use Case para procesar mensajes del usuario y generar respuestas
    
    Flujo:
    1. Obtener/crear conversación
    2. Crear Message VO
    3. Detectar intent
    4. Buscar FAQ más relevante
    5. Generar respuesta
    6. Actualizar contexto
    """
    
    def __init__(self,
                 nlp_service: NLPDomainService,
                 context_manager: ContextManagerService):
        self.nlp_service = nlp_service
        self.context_manager = context_manager
    
    async def execute(self, request: ProcessMessageRequestDTO) -> ProcessMessageResponseDTO:
        """
        Procesa un mensaje y retorna una respuesta
        """
        # 1. Obtener/crear conversación
        conversation = self.context_manager.get_or_create_conversation(
            request.session_id,
            request.user_id
        )
        
        # 2. Crear Message VO
        message = Message(request.message)
        
        # Agregar mensaje del usuario a la conversación
        conversation.add_user_message(request.message)
        
        # 3. Detectar intent
        intent_result: IntentDetectionResult = await self.nlp_service.detect_intent(message)
        
        # 4. Generar respuesta basada en el intent
        response_text: str
        confidence: float
        intent_dto: Optional[IntentDTO] = None
        suggestions: Optional[list] = None
        
        if intent_result.is_detected():
            # Intent detectado con confianza aceptable
            intent = intent_result.intent
            intent_dto = IntentDTO(
                id=intent.id,
                name=intent.name,
                category=intent.category,
                confidence=intent_result.confidence.value,
                matched_keywords=intent_result.matched_keywords
            )
            
            # Buscar FAQ más relevante
            faq_result = await self.nlp_service.find_best_faq(intent, message)
            
            if faq_result:
                faq, faq_confidence = faq_result
                response_text = faq.get_formatted_answer()
                confidence = min(intent_result.confidence.value, faq_confidence.value)
                
                # Actualizar contexto
                conversation.set_context_value("last_faq_id", faq.id)
                conversation.last_intent = intent.id
                
                # Generar sugerencias basadas en el intent
                suggestions = self._generate_suggestions(intent.category)
            else:
                # No se encontró FAQ para el intent
                response_text = await self.nlp_service.get_fallback_response()
                confidence = 0.5
        else:
            # Intent no detectado o baja confianza - buscar en toda la KB
            kb_results = await self.nlp_service.search_knowledge_base(message, top_n=1)
            
            if kb_results and kb_results[0][1].value >= 0.6:
                faq, faq_confidence = kb_results[0]
                response_text = faq.get_formatted_answer()
                confidence = faq_confidence.value
            else:
                # Fallback response
                response_text = await self.nlp_service.get_fallback_response()
                confidence = 0.3
        
        # Agregar respuesta del bot a la conversación
        conversation.add_bot_message(response_text)
        
        # Guardar conversación actualizada
        self.context_manager.save_conversation(conversation)
        
        return ProcessMessageResponseDTO(
            session_id=request.session_id,
            response=response_text,
            intent=intent_dto,
            confidence=confidence,
            suggestions=suggestions
        )
    
    def _generate_suggestions(self, category: str) -> list[str]:
        """
        Genera sugerencias de seguimiento basadas en la categoría
        """
        suggestions_map = {
            "inscripciones": [
                "¿Cuáles son los requisitos?",
                "¿Cómo me inscribo?",
                "¿Cuánto cuesta la matrícula?"
            ],
            "horarios": [
                "¿Dónde veo mi horario?",
                "¿Puedo cambiar mi horario?",
                "¿Cuándo empiezan las clases?"
            ],
            "pagos": [
                "¿Cómo pago la pensión?",
                "¿Hay descuentos?",
                "¿Qué pasa si no pago a tiempo?"
            ],
            "biblioteca": [
                "¿Cómo saco un carnet?",
                "¿Puedo reservar libros?",
                "¿Tienen recursos digitales?"
            ],
            "tramites": [
                "¿Cómo solicito un certificado?",
                "¿Cuánto demora un trámite?",
                "¿Dónde presento mi solicitud?"
            ],
            "contacto": [
                "¿Cuál es el correo de admisión?",
                "¿Tienen WhatsApp?",
                "¿Dónde está la universidad?"
            ]
        }
        
        return suggestions_map.get(category, [
            "¿Qué más puedes hacer?",
            "Necesito ayuda con otro tema"
        ])
