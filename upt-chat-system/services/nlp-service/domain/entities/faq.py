"""
FAQ Entity - Domain Layer
Representa una pregunta frecuente con su respuesta asociada.
"""
from dataclasses import dataclass
from typing import List, Optional
from datetime import datetime


@dataclass
class FAQ:
    """
    Entidad FAQ siguiendo DDD
    
    Representa una pregunta frecuente del Knowledge Base de UPT.
    """
    
    id: str
    intent_id: str
    question: str
    answer: str
    keywords: List[str]
    category: str
    priority: int
    metadata: Optional[dict] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    def __post_init__(self):
        """Validaciones de negocio"""
        if not self.id or not self.id.strip():
            raise ValueError("FAQ ID cannot be empty")
        
        if not self.intent_id or not self.intent_id.strip():
            raise ValueError("FAQ must be associated with an intent")
        
        if not self.question or not self.question.strip():
            raise ValueError("FAQ question cannot be empty")
        
        if not self.answer or not self.answer.strip():
            raise ValueError("FAQ answer cannot be empty")
        
        if self.priority < 0 or self.priority > 10:
            raise ValueError("Priority must be between 0 and 10")
        
        if self.metadata is None:
            self.metadata = {}
    
    def contains_keyword(self, text: str) -> bool:
        """
        Verifica si el texto contiene alguna keyword del FAQ
        """
        text_lower = text.lower()
        return any(keyword.lower() in text_lower for keyword in self.keywords)
    
    def calculate_relevance(self, query: str) -> float:
        """
        Calcula relevancia de este FAQ para una consulta dada
        Basado en keywords matching
        """
        query_lower = query.lower()
        matches = sum(1 for kw in self.keywords if kw.lower() in query_lower)
        
        if matches == 0:
            return 0.0
        
        # Normalizar por número de keywords y agregar bonus por prioridad
        relevance = (matches / len(self.keywords)) * 0.8
        priority_bonus = (self.priority / 10) * 0.2
        
        return min(relevance + priority_bonus, 1.0)
    
    def get_formatted_answer(self, user_name: Optional[str] = None) -> str:
        """
        Retorna respuesta formateada, opcionalmente personalizada
        """
        answer = self.answer
        
        if user_name:
            answer = f"{user_name}, {answer[0].lower()}{answer[1:]}"
        
        return answer
    
    def __str__(self) -> str:
        return f"FAQ({self.intent_id}, priority={self.priority})"
    
    def __repr__(self) -> str:
        return self.__str__()
