"""
Intent Repository Interface - Domain Layer
Define el contrato para repositorios de Intent.
"""
from abc import ABC, abstractmethod
from typing import List, Optional
from domain.entities.intent import Intent


class IIntentRepository(ABC):
    """
    Interface del repositorio de Intents
    
    Define las operaciones que cualquier implementación debe proveer.
    No depende de detalles de infraestructura (JSON, MongoDB, etc.)
    """
    
    @abstractmethod
    async def get_all(self) -> List[Intent]:
        """
        Obtiene todos los intents disponibles
        """
        pass
    
    @abstractmethod
    async def find_by_id(self, intent_id: str) -> Optional[Intent]:
        """
        Busca un intent por su ID
        """
        pass
    
    @abstractmethod
    async def find_by_name(self, name: str) -> Optional[Intent]:
        """
        Busca un intent por su nombre
        """
        pass
    
    @abstractmethod
    async def find_by_keywords(self, keywords: List[str]) -> List[Intent]:
        """
        Busca intents que contengan alguna de las keywords
        """
        pass
    
    @abstractmethod
    async def find_by_category(self, category: str) -> List[Intent]:
        """
        Busca intents por categoría
        """
        pass
    
    @abstractmethod
    async def get_high_priority(self, min_priority: int = 7) -> List[Intent]:
        """
        Obtiene intents de alta prioridad
        """
        pass
