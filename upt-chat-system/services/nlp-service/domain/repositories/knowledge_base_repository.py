"""
Knowledge Base Repository Interface - Domain Layer
Define el contrato para repositorios de FAQs.
"""
from abc import ABC, abstractmethod
from typing import List, Optional
from domain.entities.faq import FAQ


class IKnowledgeBaseRepository(ABC):
    """
    Interface del repositorio de Knowledge Base (FAQs)
    
    Define las operaciones para acceder a la base de conocimiento.
    """
    
    @abstractmethod
    async def get_all(self) -> List[FAQ]:
        """
        Obtiene todos los FAQs disponibles
        """
        pass
    
    @abstractmethod
    async def find_by_id(self, faq_id: str) -> Optional[FAQ]:
        """
        Busca un FAQ por su ID
        """
        pass
    
    @abstractmethod
    async def find_by_intent(self, intent_id: str) -> List[FAQ]:
        """
        Busca FAQs asociados a un intent específico
        """
        pass
    
    @abstractmethod
    async def search_by_keywords(self, keywords: List[str]) -> List[FAQ]:
        """
        Busca FAQs que contengan alguna de las keywords
        """
        pass
    
    @abstractmethod
    async def find_by_category(self, category: str) -> List[FAQ]:
        """
        Busca FAQs por categoría
        """
        pass
    
    @abstractmethod
    async def search_relevant(self, query: str, top_n: int = 5) -> List[tuple[FAQ, float]]:
        """
        Busca los FAQs más relevantes para una consulta
        Retorna lista de (FAQ, relevance_score)
        """
        pass
    
    @abstractmethod
    async def get_high_priority(self, min_priority: int = 7) -> List[FAQ]:
        """
        Obtiene FAQs de alta prioridad
        """
        pass
