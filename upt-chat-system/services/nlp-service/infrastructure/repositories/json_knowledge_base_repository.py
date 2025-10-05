"""
Knowledge Base Repository Implementation - Infrastructure Layer
Implementación del repositorio de knowledge base usando archivos JSON.
"""
import json
from typing import List, Tuple, Optional
from pathlib import Path
from domain.entities.faq import FAQ
from domain.repositories.knowledge_base_repository import IKnowledgeBaseRepository


class JsonKnowledgeBaseRepository(IKnowledgeBaseRepository):
    """
    Implementación del repositorio de knowledge base usando JSON
    
    Almacena FAQs en un archivo JSON.
    """
    
    def __init__(self, data_path: str = "data/faqs.json"):
        self.data_path = Path(data_path)
        self._faqs: List[FAQ] = []
        self._load_faqs()
    
    def _load_faqs(self) -> None:
        """
        Carga los FAQs desde el archivo JSON
        """
        if not self.data_path.exists():
            raise FileNotFoundError(f"FAQ data file not found: {self.data_path}")
        
        with open(self.data_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        self._faqs = []
        for item in data.get('faqs', []):
            faq = FAQ(
                id=item['id'],
                intent_id=item['intent_id'],
                question=item['question'],
                answer=item['answer'],
                keywords=item.get('keywords', []),
                priority=item.get('priority', 5),
                metadata=item.get('metadata', {})
            )
            self._faqs.append(faq)
    
    async def get_all(self) -> List[FAQ]:
        """
        Obtiene todos los FAQs
        """
        return self._faqs.copy()
    
    async def find_by_intent(self, intent_id: str) -> List[FAQ]:
        """
        Busca FAQs por intent_id
        """
        return [
            faq for faq in self._faqs
            if faq.intent_id == intent_id
        ]
    
    async def find_by_id(self, faq_id: str) -> Optional[FAQ]:
        """
        Busca un FAQ por ID
        """
        for faq in self._faqs:
            if faq.id == faq_id:
                return faq
        return None
    
    async def search_by_keywords(self, keywords: List[str]) -> List[FAQ]:
        """
        Busca FAQs que contengan alguna de las keywords
        """
        matching_faqs = []
        keywords_lower = [k.lower() for k in keywords]
        
        for faq in self._faqs:
            for keyword in keywords_lower:
                if any(keyword in kw.lower() for kw in faq.keywords):
                    matching_faqs.append(faq)
                    break
        
        # Ordenar por prioridad
        matching_faqs.sort(key=lambda f: f.priority, reverse=True)
        return matching_faqs
    
    async def search_relevant(self, query: str, top_n: int = 5) -> List[Tuple[FAQ, float]]:
        """
        Busca los FAQs más relevantes para una query
        
        Usa calculate_relevance del FAQ entity
        """
        faq_scores: List[Tuple[FAQ, float]] = []
        
        for faq in self._faqs:
            relevance = faq.calculate_relevance(query)
            if relevance > 0:
                faq_scores.append((faq, relevance))
        
        # Ordenar por relevancia descendente
        faq_scores.sort(key=lambda x: x[1], reverse=True)
        
        # Retornar top N
        return faq_scores[:top_n]
    
    async def get_high_priority(self, min_priority: int = 7) -> List[FAQ]:
        """
        Obtiene FAQs de alta prioridad
        """
        high_priority = [
            faq for faq in self._faqs
            if faq.priority >= min_priority
        ]
        high_priority.sort(key=lambda f: f.priority, reverse=True)
        return high_priority
    
    async def get_by_category(self, category: str) -> List[FAQ]:
        """
        Obtiene FAQs por categoría (basado en metadata)
        """
        return [
            faq for faq in self._faqs
            if faq.metadata.get('category', '').lower() == category.lower()
        ]
    
    def reload(self) -> None:
        """
        Recarga los FAQs desde el archivo (útil para hot-reload)
        """
        self._load_faqs()
