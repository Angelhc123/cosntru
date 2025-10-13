"""
Intent Repository Implementation - Infrastructure Layer
Implementación del repositorio de intents usando archivos JSON.
"""
import json
from typing import List, Optional
from pathlib import Path
from domain.entities.intent import Intent
from domain.repositories.intent_repository import IIntentRepository


class JsonIntentRepository(IIntentRepository):
    """
    Implementación del repositorio de intents usando JSON
    
    En producción podría ser MongoDB, PostgreSQL, etc.
    Para el demo usamos JSON por simplicidad.
    """
    
    def __init__(self, data_path: str = "data/intents.json"):
        self.data_path = Path(data_path)
        self._intents: List[Intent] = []
        self._load_intents()
    
    def _load_intents(self) -> None:
        """
        Carga los intents desde el archivo JSON
        """
        if not self.data_path.exists():
            raise FileNotFoundError(f"Intent data file not found: {self.data_path}")
        
        with open(self.data_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        self._intents = []
        for item in data.get('intents', []):
            intent = Intent(
                id=item['id'],
                name=item['name'],
                display_name=item.get('display_name', item['name']),
                keywords=item['keywords'],
                examples=item.get('examples', []),
                category=item['category'],
                priority=item.get('priority', 5),
                requires_context=item.get('requires_context', False)
            )
            self._intents.append(intent)
    
    async def get_all(self) -> List[Intent]:
        """
        Obtiene todos los intents
        """
        return self._intents.copy()
    
    async def find_by_id(self, intent_id: str) -> Optional[Intent]:
        """
        Busca un intent por ID
        """
        for intent in self._intents:
            if intent.id == intent_id:
                return intent
        return None
    
    async def find_by_name(self, name: str) -> Optional[Intent]:
        """
        Busca un intent por nombre exacto
        """
        for intent in self._intents:
            if intent.name.lower() == name.lower():
                return intent
        return None
    
    async def find_by_keywords(self, keywords: List[str]) -> List[Intent]:
        """
        Busca intents que contengan alguna de las keywords
        """
        matching_intents = []
        keywords_lower = [k.lower() for k in keywords]
        
        for intent in self._intents:
            for keyword in keywords_lower:
                if any(keyword in kw.lower() for kw in intent.keywords):
                    matching_intents.append(intent)
                    break
        
        return matching_intents
    
    async def find_by_category(self, category: str) -> List[Intent]:
        """
        Busca intents por categoría
        """
        return [
            intent for intent in self._intents
            if intent.category.lower() == category.lower()
        ]
    
    async def get_high_priority(self, min_priority: int = 7) -> List[Intent]:
        """
        Obtiene intents de alta prioridad
        """
        return [
            intent for intent in self._intents
            if intent.priority >= min_priority
        ]
    
    def reload(self) -> None:
        """
        Recarga los intents desde el archivo (útil para hot-reload)
        """
        self._load_intents()
