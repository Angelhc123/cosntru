"""
NLP Domain Service - Domain Layer
Contiene la lógica de negocio para procesamiento NLP.
"""
from typing import List, Optional, Tuple
from domain.entities.intent import Intent
from domain.entities.faq import FAQ
from domain.value_objects.confidence import Confidence
from domain.value_objects.message import Message
from domain.repositories.intent_repository import IIntentRepository
from domain.repositories.knowledge_base_repository import IKnowledgeBaseRepository


class IntentDetectionResult:
    """Resultado de detección de intent"""
    
    def __init__(self, intent: Optional[Intent], confidence: Confidence, 
                 matched_keywords: List[str]):
        self.intent = intent
        self.confidence = confidence
        self.matched_keywords = matched_keywords
    
    def is_detected(self) -> bool:
        """Verifica si se detectó un intent con confianza aceptable"""
        return self.intent is not None and self.confidence.is_acceptable()
    
    def __repr__(self) -> str:
        intent_name = self.intent.name if self.intent else "None"
        return f"IntentDetectionResult(intent={intent_name}, confidence={self.confidence})"


class NLPDomainService:
    """
    Servicio de dominio para procesamiento NLP
    
    Contiene la lógica de negocio central:
    - Detección de intents
    - Matching con knowledge base
    - Cálculo de relevancia y confianza
    """
    
    def __init__(self, 
                 intent_repository: IIntentRepository,
                 knowledge_base_repository: IKnowledgeBaseRepository):
        self.intent_repository = intent_repository
        self.knowledge_base_repository = knowledge_base_repository
    
    async def detect_intent(self, message: Message) -> IntentDetectionResult:
        """
        Detecta el intent más probable para un mensaje
        
        Estrategia:
        1. Buscar intents por keywords
        2. Calcular score para cada intent
        3. Retornar el de mayor score con su confianza
        """
        all_intents = await self.intent_repository.get_all()
        
        if not all_intents:
            return IntentDetectionResult(None, Confidence(0.0), [])
        
        # Calcular scores para cada intent
        intent_scores: List[Tuple[Intent, float, List[str]]] = []
        
        for intent in all_intents:
            score, matched_kws = self._calculate_intent_score(message, intent)
            if score > 0:
                intent_scores.append((intent, score, matched_kws))
        
        if not intent_scores:
            # No se encontró match
            return IntentDetectionResult(None, Confidence(0.0), [])
        
        # Ordenar por score descendente
        intent_scores.sort(key=lambda x: x[1], reverse=True)
        
        best_intent, best_score, matched_keywords = intent_scores[0]
        
        # Convertir score a confidence
        confidence = self._score_to_confidence(best_score)
        
        return IntentDetectionResult(best_intent, confidence, matched_keywords)
    
    def _calculate_intent_score(self, message: Message, intent: Intent) -> Tuple[float, List[str]]:
        """
        Calcula score de matching entre mensaje e intent
        
        Retorna: (score, matched_keywords)
        """
        matched_keywords = []
        message_text = message.normalized_text
        
        # Verificar keywords del intent
        for keyword in intent.keywords:
            keyword_normalized = Message._normalize_text(keyword)
            if keyword_normalized in message_text:
                matched_keywords.append(keyword)
        
        if not matched_keywords:
            return 0.0, []
        
        # Score base: porcentaje de keywords matched
        keyword_match_ratio = len(matched_keywords) / len(intent.keywords)
        
        # Bonus por prioridad del intent
        priority_bonus = (intent.priority / 10) * 0.2
        
        # Bonus si el mensaje es una pregunta y el intent está diseñado para eso
        question_bonus = 0.1 if message.is_question() else 0.0
        
        # Score total (max 1.0)
        total_score = min(
            keyword_match_ratio * 0.7 + priority_bonus + question_bonus,
            1.0
        )
        
        return total_score, matched_keywords
    
    def _score_to_confidence(self, score: float) -> Confidence:
        """
        Convierte un score de matching a Confidence
        """
        return Confidence(score)
    
    async def find_best_faq(self, intent: Intent, message: Message) -> Optional[Tuple[FAQ, Confidence]]:
        """
        Encuentra el FAQ más relevante para un intent y mensaje
        
        Retorna: (FAQ, Confidence) o None
        """
        # Buscar FAQs por intent
        faqs = await self.knowledge_base_repository.find_by_intent(intent.id)
        
        if not faqs:
            return None
        
        # Calcular relevancia de cada FAQ
        faq_scores: List[Tuple[FAQ, float]] = []
        
        for faq in faqs:
            relevance = faq.calculate_relevance(message.original_text)
            if relevance > 0:
                faq_scores.append((faq, relevance))
        
        if not faq_scores:
            # Retornar el FAQ de mayor prioridad
            faqs.sort(key=lambda f: f.priority, reverse=True)
            return faqs[0], Confidence(0.6)
        
        # Ordenar por relevancia
        faq_scores.sort(key=lambda x: x[1], reverse=True)
        
        best_faq, relevance_score = faq_scores[0]
        
        return best_faq, Confidence(relevance_score)
    
    async def search_knowledge_base(self, message: Message, top_n: int = 5) -> List[Tuple[FAQ, Confidence]]:
        """
        Busca en toda la knowledge base sin necesidad de intent detectado
        
        Útil como fallback cuando no se detecta intent con alta confianza
        """
        results = await self.knowledge_base_repository.search_relevant(
            message.original_text,
            top_n=top_n
        )
        
        return [(faq, Confidence(score)) for faq, score in results]
    
    async def get_fallback_response(self) -> str:
        """
        Retorna una respuesta genérica cuando no se puede procesar el mensaje
        """
        return (
            "Disculpa, no estoy seguro de entender tu pregunta. "
            "¿Podrías reformularla? Puedo ayudarte con información sobre "
            "inscripciones, horarios, pagos, biblioteca y trámites académicos."
        )
    
    async def get_greeting_response(self, user_name: Optional[str] = None) -> str:
        """
        Retorna un saludo personalizado
        """
        if user_name:
            return (
                f"¡Hola {user_name}! Soy el asistente virtual de la Universidad Privada de Tacna. "
                "¿En qué puedo ayudarte hoy?"
            )
        return (
            "¡Hola! Soy el asistente virtual de la Universidad Privada de Tacna. "
            "¿En qué puedo ayudarte hoy?"
        )
    
    async def get_farewell_response(self) -> str:
        """
        Retorna una despedida
        """
        return (
            "¡Hasta luego! Si necesitas más ayuda, no dudes en escribirme. "
            "¡Que tengas un excelente día! 👋"
        )
