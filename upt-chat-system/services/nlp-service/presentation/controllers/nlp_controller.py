"""
NLP Controller - Presentation Layer
Controlador principal para endpoints de NLP.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from application.use_cases.process_message_use_case import ProcessMessageUseCase
from application.use_cases.detect_intent_use_case import DetectIntentUseCase
from application.use_cases.search_knowledge_base_use_case import SearchKnowledgeBaseUseCase
from application.dtos.process_request_dto import (
    ProcessMessageRequestDTO,
    DetectIntentRequestDTO,
    SearchKnowledgeBaseRequestDTO
)
from application.dtos.nlp_response_dto import (
    ProcessMessageResponseDTO,
    DetectIntentResponseDTO,
    SearchKnowledgeBaseResponseDTO,
    ErrorResponseDTO
)
from infrastructure.logging.logger_config import logger


router = APIRouter(prefix="/api/v1/nlp", tags=["NLP"])


# Dependency injection placeholder - se configura en main.py
_process_message_use_case: ProcessMessageUseCase = None
_detect_intent_use_case: DetectIntentUseCase = None
_search_kb_use_case: SearchKnowledgeBaseUseCase = None


def set_use_cases(
    process_message: ProcessMessageUseCase,
    detect_intent: DetectIntentUseCase,
    search_kb: SearchKnowledgeBaseUseCase
):
    """
    Configura los use cases (llamado desde main.py)
    """
    global _process_message_use_case, _detect_intent_use_case, _search_kb_use_case
    _process_message_use_case = process_message
    _detect_intent_use_case = detect_intent
    _search_kb_use_case = search_kb


@router.post(
    "/process",
    response_model=ProcessMessageResponseDTO,
    status_code=status.HTTP_200_OK,
    summary="Procesar mensaje del usuario",
    description="Procesa un mensaje del usuario y genera una respuesta inteligente"
)
async def process_message(request: ProcessMessageRequestDTO):
    """
    Endpoint principal para procesar mensajes
    
    Flujo:
    1. Detecta el intent del mensaje
    2. Busca la respuesta más relevante
    3. Genera sugerencias de seguimiento
    4. Mantiene el contexto de conversación
    """
    try:
        logger.info(f"Processing message from session {request.session_id}")
        
        if not _process_message_use_case:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Service not initialized"
            )
        
        response = await _process_message_use_case.execute(request)
        
        logger.info(
            f"Message processed successfully. "
            f"Intent: {response.intent.id if response.intent else 'None'}, "
            f"Confidence: {response.confidence}"
        )
        
        return response
        
    except Exception as e:
        logger.error(f"Error processing message: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing message: {str(e)}"
        )


@router.post(
    "/detect-intent",
    response_model=DetectIntentResponseDTO,
    status_code=status.HTTP_200_OK,
    summary="Detectar intent",
    description="Detecta el intent de un mensaje sin generar respuesta completa"
)
async def detect_intent(request: DetectIntentRequestDTO):
    """
    Endpoint para detectar solo el intent
    
    Útil para:
    - Testing y debugging
    - Análisis de mensajes
    - Métricas de detección
    """
    try:
        logger.debug(f"Detecting intent for message: {request.message[:50]}...")
        
        if not _detect_intent_use_case:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Service not initialized"
            )
        
        response = await _detect_intent_use_case.execute(request)
        
        logger.debug(f"Intent detected: {response.intent.id if response.intent else 'None'}")
        
        return response
        
    except Exception as e:
        logger.error(f"Error detecting intent: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error detecting intent: {str(e)}"
        )


@router.post(
    "/search",
    response_model=SearchKnowledgeBaseResponseDTO,
    status_code=status.HTTP_200_OK,
    summary="Buscar en knowledge base",
    description="Busca directamente en la base de conocimientos"
)
async def search_knowledge_base(request: SearchKnowledgeBaseRequestDTO):
    """
    Endpoint para búsqueda directa en la KB
    
    No requiere detección de intent, busca por similitud semántica.
    """
    try:
        logger.debug(f"Searching KB for: {request.query}")
        
        if not _search_kb_use_case:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Service not initialized"
            )
        
        response = await _search_kb_use_case.execute(request)
        
        logger.debug(f"Found {response.total_found} results")
        
        return response
        
    except Exception as e:
        logger.error(f"Error searching KB: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error searching knowledge base: {str(e)}"
        )


@router.get(
    "/health",
    status_code=status.HTTP_200_OK,
    summary="Health check del servicio NLP"
)
async def health_check():
    """
    Verifica el estado del servicio
    """
    return {
        "status": "healthy",
        "service": "nlp-service",
        "version": "1.0.0"
    }
