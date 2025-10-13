"""
NLP Response DTO - Application Layer
Define el formato de salida de las respuestas.
"""
from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime


class IntentDTO(BaseModel):
    """DTO para representar un intent detectado"""
    id: str
    name: str
    category: str
    confidence: float
    matched_keywords: List[str]


class FAQDTO(BaseModel):
    """DTO para representar un FAQ"""
    id: str
    question: str
    answer: str
    relevance: float


class ProcessMessageResponseDTO(BaseModel):
    """
    Response DTO principal para mensajes procesados
    """
    session_id: str = Field(..., description="ID de sesión")
    response: str = Field(..., description="Respuesta del bot")
    intent: Optional[IntentDTO] = Field(None, description="Intent detectado")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confianza de la respuesta")
    suggestions: Optional[List[str]] = Field(None, description="Sugerencias de seguimiento")
    timestamp: datetime = Field(default_factory=datetime.now)
    requires_validation: bool = Field(default=False, description="Indica si requiere validación por email")
    validation_state: Optional[str] = Field(default=None, description="Estado actual de validación")
    validation_message: Optional[str] = Field(default=None, description="Mensaje específico de validación")
    
    class Config:
        schema_extra = {
            "example": {
                "session_id": "sess_123abc",
                "response": "Las inscripciones para el semestre 2024-I son del 15 al 25 de febrero.",
                "intent": {
                    "id": "inscripciones.fecha",
                    "name": "Consultar fechas de inscripción",
                    "category": "inscripciones",
                    "confidence": 0.92,
                    "matched_keywords": ["inscripciones", "fechas"]
                },
                "confidence": 0.92,
                "suggestions": [
                    "¿Cuáles son los requisitos?",
                    "¿Cómo me inscribo?"
                ],
                "timestamp": "2024-01-15T10:30:00"
            }
        }


class DetectIntentResponseDTO(BaseModel):
    """
    Response DTO para detección de intent
    """
    intent: Optional[IntentDTO] = Field(None, description="Intent detectado")
    confidence: float = Field(..., ge=0.0, le=1.0)
    message: str = Field(..., description="Mensaje sobre la detección")
    
    class Config:
        schema_extra = {
            "example": {
                "intent": {
                    "id": "pagos.pensiones",
                    "name": "Consultar pagos y pensiones",
                    "category": "pagos",
                    "confidence": 0.88,
                    "matched_keywords": ["pago", "pensiones"]
                },
                "confidence": 0.88,
                "message": "Intent detectado con alta confianza"
            }
        }


class SearchResultDTO(BaseModel):
    """DTO para un resultado de búsqueda"""
    faq: FAQDTO
    confidence: float


class SearchKnowledgeBaseResponseDTO(BaseModel):
    """
    Response DTO para búsqueda en knowledge base
    """
    results: List[SearchResultDTO] = Field(..., description="Resultados de la búsqueda")
    total_found: int = Field(..., description="Total de resultados encontrados")
    query: str = Field(..., description="Query original")
    
    class Config:
        schema_extra = {
            "example": {
                "results": [
                    {
                        "faq": {
                            "id": "faq_001",
                            "question": "¿Cuál es el horario de la biblioteca?",
                            "answer": "La biblioteca está abierta de lunes a viernes de 8:00 AM a 8:00 PM.",
                            "relevance": 0.95
                        },
                        "confidence": 0.95
                    }
                ],
                "total_found": 1,
                "query": "biblioteca horarios"
            }
        }


class ErrorResponseDTO(BaseModel):
    """
    Response DTO para errores
    """
    error: str = Field(..., description="Tipo de error")
    message: str = Field(..., description="Descripción del error")
    details: Optional[dict] = Field(None, description="Detalles adicionales")
    timestamp: datetime = Field(default_factory=datetime.now)
    
    class Config:
        schema_extra = {
            "example": {
                "error": "ValidationError",
                "message": "El mensaje no puede estar vacío",
                "details": {"field": "message"},
                "timestamp": "2024-01-15T10:30:00"
            }
        }
