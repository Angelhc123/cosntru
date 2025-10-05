"""
Intent Entity - Domain Layer
Representa una intención que el usuario puede expresar en la conversación.
"""
from dataclasses import dataclass
from typing import List, Optional
from datetime import datetime


@dataclass
class Intent:
    """
    Entidad Intent siguiendo DDD
    
    Un Intent representa una intención específica que el usuario puede expresar,
    como "consultar fechas de inscripción", "preguntar por horarios", etc.
    """
    
    id: str
    name: str
    display_name: str
    keywords: List[str]
    examples: List[str]
    category: str
    priority: int
    requires_context: bool
    created_at: Optional[datetime] = None
    
    def __post_init__(self):
        """Validaciones de negocio"""
        if not self.id or not self.id.strip():
            raise ValueError("Intent ID cannot be empty")
        
        if not self.name or not self.name.strip():
            raise ValueError("Intent name cannot be empty")
        
        if not self.keywords or len(self.keywords) == 0:
            raise ValueError("Intent must have at least one keyword")
        
        if self.priority < 0 or self.priority > 10:
            raise ValueError("Priority must be between 0 and 10")
    
    def matches_keyword(self, text: str) -> bool:
        """
        Verifica si el texto contiene alguna keyword del intent
        """
        text_lower = text.lower()
        return any(keyword.lower() in text_lower for keyword in self.keywords)
    
    def get_normalized_keywords(self) -> List[str]:
        """
        Retorna keywords normalizadas (lowercase, sin acentos)
        """
        return [self._normalize_text(kw) for kw in self.keywords]
    
    @staticmethod
    def _normalize_text(text: str) -> str:
        """Normaliza texto removiendo acentos y convirtiendo a lowercase"""
        import unicodedata
        text = text.lower()
        # Remover acentos
        text = ''.join(
            c for c in unicodedata.normalize('NFD', text)
            if unicodedata.category(c) != 'Mn'
        )
        return text
    
    def __str__(self) -> str:
        return f"Intent({self.name}, priority={self.priority})"
    
    def __repr__(self) -> str:
        return self.__str__()
