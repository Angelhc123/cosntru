"""
Process Message Use Case - Application Layer
Caso de uso principal para procesar mensajes del usuario.
Implementa RF004 - Validación por Correo Personal
"""
from typing import Optional
import re
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
from application.detectors.sensitive_query_detector import SensitiveQueryDetector
from infrastructure.clients.api_gateway_client import ApiGatewayClient
import logging

logger = logging.getLogger(__name__)


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
        self.sensitive_detector = SensitiveQueryDetector()
        self.api_client = ApiGatewayClient()
    
    async def execute(self, request: ProcessMessageRequestDTO) -> ProcessMessageResponseDTO:
        """
        Procesa un mensaje y retorna una respuesta
        Implementa RF004: Validación por correo para consultas sensibles
        """
        # 1. Obtener/crear conversación
        conversation = self.context_manager.get_or_create_conversation(
            request.session_id,
            request.user_id
        )
        
        # 2. Crear Message VO
        message = Message.create(request.message)
        
        # Agregar mensaje del usuario a la conversación
        conversation.add_user_message(request.message)
        
        # 2.1 NUEVO: Verificar si estamos en un flujo de validación
        if request.validation_state == "awaiting_email":
            # Usuario debe proporcionar su email
            return await self._handle_email_input(request, conversation)
        
        elif request.validation_state == "awaiting_confirmation":
            # Usuario confirmó su email, esperando validación
            return await self._handle_awaiting_confirmation(request, conversation)
        
        # 2.2 NUEVO: Detectar si es consulta sensible (RF004)
        if self.sensitive_detector.is_sensitive_query(request.message):
            category = self.sensitive_detector.get_sensitive_category(request.message)
            validation_prompt = self.sensitive_detector.get_validation_prompt(category)
            
            logger.info(f"Consulta sensible detectada: {category} en sesión {request.session_id}")
            
            # Guardar categoría en el contexto
            conversation.set_context_value("pending_category", category)
            conversation.set_context_value("original_query", request.message)
            
            return ProcessMessageResponseDTO(
                session_id=request.session_id,
                response=validation_prompt,
                intent=None,
                confidence=1.0,
                requires_validation=True,
                validation_state="awaiting_email",
                validation_message=validation_prompt
            )
        
        # 3. Flujo normal: Detectar intent
        hybrid_result = None  # Para almacenar resultado de Dialogflow
        
        # Para híbrido service, usamos método específico
        if hasattr(self.nlp_service, 'detect_intent') and len(self.nlp_service.detect_intent.__code__.co_varnames) > 2:
            # Híbrido service: devuelve dict, necesitamos convertir
            hybrid_result = await self.nlp_service.detect_intent(request.session_id, message)
            
            # Convertir respuesta de híbrido a IntentDetectionResult
            from domain.entities.intent import Intent
            from domain.value_objects.confidence import Confidence
            
            if hybrid_result.get('intent_name') and hybrid_result.get('confidence', 0) > 0.5:
                # Intent detectado por DialogFlow
                intent = Intent(
                    id=hybrid_result.get('intent_name', 'unknown'),
                    name=hybrid_result.get('intent_name', 'Unknown'),
                    display_name=hybrid_result.get('intent_name', 'Unknown'),
                    keywords=['dialogflow_intent'],  # Al menos una keyword requerida
                    examples=[hybrid_result.get('query_text', '')],
                    category='dialogflow',
                    priority=10,
                    requires_context=False
                )
                confidence = Confidence(hybrid_result.get('confidence', 0.0))
                
                intent_result = IntentDetectionResult(
                    intent=intent,
                    confidence=confidence,
                    matched_keywords=[]
                )
            else:
                # No detectado o confianza baja
                intent_result = IntentDetectionResult(None, Confidence(0.0), [])
        else:
            # NLP Service normal
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
            
            # Si es de Dialogflow, usar su respuesta directamente
            if intent.category == 'dialogflow' and hybrid_result:
                response_text = hybrid_result.get('fulfillment_text', 'Respuesta de Dialogflow no disponible')
                confidence = intent_result.confidence.value
            else:
                # Buscar FAQ más relevante (solo para NLP local)
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
    
    async def _handle_email_input(self, request: ProcessMessageRequestDTO, conversation) -> ProcessMessageResponseDTO:
        """
        Maneja la entrada de email del usuario para validación (RF004)
        """
        email = request.message.strip()
        
        # Validar formato de email
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, email):
            return ProcessMessageResponseDTO(
                session_id=request.session_id,
                response="Por favor, ingresa un correo electrónico válido. Por ejemplo: tunombre@upt.edu.pe o tunombre@gmail.com",
                intent=None,
                confidence=1.0,
                requires_validation=True,
                validation_state="awaiting_email",
                validation_message="Email inválido, intenta nuevamente"
            )
        
        # Verificar email con API Gateway
        logger.info(f"Verificando email {email} en sesión {request.session_id}")
        verification_result = await self.api_client.verify_email(email)
        
        if not verification_result.get("exists", False):
            return ProcessMessageResponseDTO(
                session_id=request.session_id,
                response="El correo electrónico no está registrado en el sistema UPT. Por favor verifica que sea correcto o contacta con soporte en soporte@upt.edu.pe",
                intent=None,
                confidence=1.0,
                requires_validation=True,
                validation_state="awaiting_email",
                validation_message="Email no encontrado"
            )
        
        # Email válido y existe - Iniciar proceso de reset
        pending_category = conversation.get_context_value("pending_category", "password")
        
        if pending_category == "password":
            # Iniciar recuperación de contraseña
            reset_result = await self.api_client.initiate_password_reset(email, request.session_id)
            
            if reset_result.get("success", False):
                user_name = verification_result.get("name", "")
                conversation.set_context_value("validated_email", email)
                conversation.set_context_value("user_name", user_name)
                
                return ProcessMessageResponseDTO(
                    session_id=request.session_id,
                    response=f"Perfecto, {user_name}. He enviado un correo de confirmación a {email}. Por favor, revisa tu bandeja de entrada y haz clic en el enlace de confirmación. Te notificaré aquí cuando completes el proceso.",
                    intent=None,
                    confidence=1.0,
                    requires_validation=True,
                    validation_state="awaiting_confirmation",
                    validation_message="Esperando confirmación por email"
                )
            else:
                return ProcessMessageResponseDTO(
                    session_id=request.session_id,
                    response="Hubo un error al procesar tu solicitud. Por favor intenta nuevamente o contacta con soporte.",
                    intent=None,
                    confidence=1.0,
                    requires_validation=False,
                    validation_state=None
                )
        else:
            # Otras categorías sensibles (notas, pagos, etc.)
            # Por ahora retornar mensaje genérico
            return ProcessMessageResponseDTO(
                session_id=request.session_id,
                response=f"Para acceder a tu información de {pending_category}, necesitarás ingresar al sistema UPT. Visita https://intranet.upt.edu.pe con tu usuario y contraseña.",
                intent=None,
                confidence=1.0,
                requires_validation=False,
                validation_state=None
            )
    
    async def _handle_awaiting_confirmation(self, request: ProcessMessageRequestDTO, conversation) -> ProcessMessageResponseDTO:
        """
        Maneja el estado de espera de confirmación por email (RF004)
        """
        # Verificar estado de la validación
        status_result = await self.api_client.check_validation_status(request.session_id)
        
        status = status_result.get("status", "pending")
        
        if status == "confirmed":
            # Usuario ya confirmó por email
            return ProcessMessageResponseDTO(
                session_id=request.session_id,
                response="¡Excelente! Tu identidad ha sido confirmada. Tu nueva contraseña ha sido enviada a tu correo electrónico. Por favor revisa tu bandeja de entrada.",
                intent=None,
                confidence=1.0,
                requires_validation=False,
                validation_state="validated"
            )
        elif status == "expired":
            return ProcessMessageResponseDTO(
                session_id=request.session_id,
                response="El enlace de confirmación ha expirado. Por favor inicia el proceso nuevamente escribiendo 'olvidé mi contraseña'.",
                intent=None,
                confidence=1.0,
                requires_validation=False,
                validation_state=None
            )
        else:
            # Aún pendiente
            return ProcessMessageResponseDTO(
                session_id=request.session_id,
                response="Aún estoy esperando que confirmes tu correo electrónico. Por favor revisa tu bandeja de entrada y haz clic en el enlace de confirmación. Si no lo encuentras, revisa tu carpeta de spam.",
                intent=None,
                confidence=1.0,
                requires_validation=True,
                validation_state="awaiting_confirmation",
                validation_message="Aún esperando confirmación"
            )
