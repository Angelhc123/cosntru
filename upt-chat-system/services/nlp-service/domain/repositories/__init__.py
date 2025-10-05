"""
Domain Repositories
"""
from .intent_repository import IIntentRepository
from .knowledge_base_repository import IKnowledgeBaseRepository

__all__ = [
    'IIntentRepository',
    'IKnowledgeBaseRepository',
]
