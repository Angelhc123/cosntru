"""
NLP Engine Initializer - Infrastructure Layer
Inicializa y configura el motor NLP con el corpus.
"""
from typing import List
from infrastructure.nlp.nlp_engine import NLPEngine
from domain.repositories.knowledge_base_repository import IKnowledgeBaseRepository


class NLPEngineInitializer:
    """
    Inicializador del motor NLP
    
    Carga el corpus de la knowledge base y entrena el vectorizador.
    """
    
    @staticmethod
    async def initialize(
        kb_repository: IKnowledgeBaseRepository,
        model_name: str = "es_core_news_sm"
    ) -> NLPEngine:
        """
        Inicializa el motor NLP y entrena el vectorizador
        
        Args:
            kb_repository: Repositorio de knowledge base
            model_name: Modelo de spaCy a usar
        
        Returns:
            Motor NLP inicializado
        """
        # Crear motor NLP
        engine = NLPEngine(model_name=model_name)
        
        # Cargar todos los FAQs
        faqs = await kb_repository.get_all()
        
        # Crear corpus con preguntas y respuestas
        corpus: List[str] = []
        for faq in faqs:
            corpus.append(faq.question)
            corpus.append(faq.answer)
        
        # Entrenar vectorizador TF-IDF si hay corpus
        if corpus:
            engine.fit_corpus(corpus)
        
        return engine
