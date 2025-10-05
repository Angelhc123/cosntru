"""
Process Request DTO - Application Layer
Define el formato de entrada para procesar mensajes.
"""
from typing import Optional
from pydantic import BaseModel, Field


class ProcessMessageRequestDTO(BaseModel):
    """
    Request DTO para procesar un mensaje del usuario
    """
    session_id: str = Field(..., description="ID de sesión único")
    user_id: str = Field(..., description="ID del usuario")
    message: str = Field(..., min_length=1, max_length=1000, description="Mensaje del usuario")
    context: Optional[dict] = Field(default=None, description="Contexto adicional opcional")
    
    class Config:
        schema_extra = {
            "example": {
                "session_id": "sess_123abc",
                "user_id": "user_456def",
                "message": "¿Cuándo son las inscripciones?",
                "context": {"user_name": "Juan"}
            }
        }


class DetectIntentRequestDTO(BaseModel):
    """
    Request DTO para detectar solo el intent
    """
    message: str = Field(..., min_length=1, max_length=1000, description="Mensaje a analizar")
    
    class Config:
        schema_extra = {
            "example": {
                "message": "¿Cuánto cuesta la matrícula?"
            }
        }


class SearchKnowledgeBaseRequestDTO(BaseModel):
    """
    Request DTO para buscar en la knowledge base
    """
    query: str = Field(..., min_length=1, max_length=500, description="Consulta de búsqueda")
    top_n: int = Field(default=5, ge=1, le=10, description="Número máximo de resultados")
    
    class Config:
        schema_extra = {
            "example": {
                "query": "biblioteca horarios",
                "top_n": 5
            }
        }
