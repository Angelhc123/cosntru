"""
Application DTOs
"""
from .process_request_dto import (
    ProcessMessageRequestDTO,
    DetectIntentRequestDTO,
    SearchKnowledgeBaseRequestDTO
)
from .nlp_response_dto import (
    ProcessMessageResponseDTO,
    DetectIntentResponseDTO,
    SearchKnowledgeBaseResponseDTO,
    ErrorResponseDTO,
    IntentDTO,
    FAQDTO,
    SearchResultDTO
)

__all__ = [
    'ProcessMessageRequestDTO',
    'DetectIntentRequestDTO',
    'SearchKnowledgeBaseRequestDTO',
    'ProcessMessageResponseDTO',
    'DetectIntentResponseDTO',
    'SearchKnowledgeBaseResponseDTO',
    'ErrorResponseDTO',
    'IntentDTO',
    'FAQDTO',
    'SearchResultDTO',
]
