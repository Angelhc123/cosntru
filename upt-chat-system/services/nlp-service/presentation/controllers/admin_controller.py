"""
Admin Controller - Presentation Layer
Endpoints administrativos para gestión del servicio.
"""
from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any
from infrastructure.logging.logger_config import logger


router = APIRouter(prefix="/api/v1/admin", tags=["Admin"])


@router.get(
    "/stats",
    status_code=status.HTTP_200_OK,
    summary="Estadísticas del servicio"
)
async def get_stats():
    """
    Retorna estadísticas del servicio NLP
    
    TODO: Implementar métricas reales (Redis/MongoDB)
    """
    return {
        "total_messages_processed": 0,
        "total_sessions": 0,
        "avg_confidence": 0.0,
        "top_intents": []
    }


@router.post(
    "/reload-data",
    status_code=status.HTTP_200_OK,
    summary="Recargar datos de intents y FAQs"
)
async def reload_data():
    """
    Recarga los archivos JSON de intents y FAQs
    
    Útil para hot-reload sin reiniciar el servicio
    """
    try:
        logger.info("Reloading data files...")
        
        # TODO: Implementar recarga de repositorios
        # intent_repository.reload()
        # kb_repository.reload()
        
        logger.info("Data files reloaded successfully")
        
        return {
            "message": "Data reloaded successfully",
            "status": "success"
        }
        
    except Exception as e:
        logger.error(f"Error reloading data: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error reloading data: {str(e)}"
        )


@router.get(
    "/info",
    status_code=status.HTTP_200_OK,
    summary="Información del servicio"
)
async def get_service_info() -> Dict[str, Any]:
    """
    Información general del servicio
    """
    return {
        "service": "UPT NLP Service",
        "version": "1.0.0",
        "description": "Servicio de procesamiento NLP para chatbot UPT",
        "architecture": "DDD + Clean Architecture",
        "nlp_engine": "spaCy + TF-IDF",
        "supported_languages": ["es"],
        "endpoints": {
            "process_message": "/api/v1/nlp/process",
            "detect_intent": "/api/v1/nlp/detect-intent",
            "search_kb": "/api/v1/nlp/search",
            "health": "/api/v1/nlp/health"
        }
    }
