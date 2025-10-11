"""
DialogFlow Controller - Presentation Layer
Controlador específico para gestión de DialogFlow.
"""
from fastapi import APIRouter, HTTPException, Depends, status
from typing import Dict, Any, List
from pydantic import BaseModel

from infrastructure.nlp.dialogflow_service import DialogFlowService
from infrastructure.logging.logger_config import logger


# DTOs para DialogFlow
class CreateIntentRequest(BaseModel):
    """Request para crear intent"""
    intent_name: str
    training_phrases: List[str]
    response: str
    parameters: List[Dict[str, Any]] = []


class DetectIntentRequest(BaseModel):
    """Request para detectar intención"""
    session_id: str
    message: str


class DialogFlowStatusResponse(BaseModel):
    """Response del estado de DialogFlow"""
    available: bool
    project_id: str
    language_code: str
    credentials_configured: bool


# Router
router = APIRouter(prefix="/api/v1/dialogflow", tags=["DialogFlow"])

# Dependencia global (se configurará desde main.py)
_dialogflow_service: DialogFlowService = None


def set_dialogflow_service(service: DialogFlowService):
    """Configura el servicio DialogFlow"""
    global _dialogflow_service
    _dialogflow_service = service


async def get_dialogflow_service() -> DialogFlowService:
    """Dependencia para obtener el servicio DialogFlow"""
    if _dialogflow_service is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="DialogFlow service not configured"
        )
    return _dialogflow_service


@router.get("/status", response_model=DialogFlowStatusResponse)
async def get_dialogflow_status(
    service: DialogFlowService = Depends(get_dialogflow_service)
):
    """
    Obtiene el estado del servicio DialogFlow
    """
    try:
        return DialogFlowStatusResponse(
            available=service.is_available(),
            project_id=service.project_id,
            language_code=service.language_code,
            credentials_configured=service.credentials is not None
        )
    except Exception as e:
        logger.error(f"Error getting DialogFlow status: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting status: {str(e)}"
        )


@router.post("/detect-intent")
async def detect_intent(
    request: DetectIntentRequest,
    service: DialogFlowService = Depends(get_dialogflow_service)
):
    """
    Detecta intención usando DialogFlow
    """
    try:
        from domain.value_objects.message import Message
        
        message = Message(content=request.message)
        result = await service.detect_intent(request.session_id, message)
        
        return {
            "success": True,
            "data": result
        }
    except Exception as e:
        logger.error(f"Error detecting intent: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error detecting intent: {str(e)}"
        )


@router.get("/intents")
async def list_intents(
    service: DialogFlowService = Depends(get_dialogflow_service)
):
    """
    Lista todos los intents de DialogFlow
    """
    try:
        intents = await service.list_intents()
        
        return {
            "success": True,
            "data": intents,
            "count": len(intents)
        }
    except Exception as e:
        logger.error(f"Error listing intents: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error listing intents: {str(e)}"
        )


@router.post("/intents")
async def create_intent(
    request: CreateIntentRequest,
    service: DialogFlowService = Depends(get_dialogflow_service)
):
    """
    Crea un nuevo intent en DialogFlow
    """
    try:
        success = await service.create_intent(
            intent_name=request.intent_name,
            training_phrases=request.training_phrases,
            response=request.response,
            parameters=request.parameters
        )
        
        if success:
            return {
                "success": True,
                "message": f"Intent '{request.intent_name}' created successfully"
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to create intent '{request.intent_name}'"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating intent: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating intent: {str(e)}"
        )


@router.post("/train")
async def train_agent(
    service: DialogFlowService = Depends(get_dialogflow_service)
):
    """
    Entrena el agente DialogFlow
    """
    try:
        success = await service.train_agent()
        
        if success:
            return {
                "success": True,
                "message": "Agent training started successfully"
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to start agent training"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error training agent: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error training agent: {str(e)}"
        )