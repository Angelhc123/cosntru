"""
NLP Engine - Infrastructure Layer
Motor de procesamiento NLP usando spaCy y scikit-learn.
"""
import re
import unicodedata
from typing import List, Tuple
import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np


class NLPEngine:
    """
    Motor de procesamiento NLP
    
    Utiliza:
    - spaCy para tokenización y procesamiento base
    - TF-IDF para extracción de features
    - Cosine similarity para matching
    """
    
    def __init__(self, model_name: str = "es_core_news_sm"):
        """
        Inicializa el motor NLP
        
        Args:
            model_name: Modelo de spaCy (español por defecto)
        """
        try:
            self.nlp = spacy.load(model_name)
        except OSError:
            # Si no está instalado, dar instrucciones
            raise OSError(
                f"spaCy model '{model_name}' not found. "
                f"Install it with: python -m spacy download {model_name}"
            )
        
        # Vectorizador TF-IDF (se inicializa con fit cuando se necesite)
        self.vectorizer = None
        self._corpus_fitted = False
    
    def normalize_text(self, text: str) -> str:
        """
        Normaliza texto: lowercase, sin acentos, sin caracteres especiales
        """
        # Lowercase
        text = text.lower()
        
        # Remover acentos
        text = ''.join(
            c for c in unicodedata.normalize('NFD', text)
            if unicodedata.category(c) != 'Mn'
        )
        
        # Remover caracteres especiales (mantener solo alfanuméricos y espacios)
        text = re.sub(r'[^a-z0-9\s]', ' ', text)
        
        # Remover espacios múltiples
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
    
    def tokenize(self, text: str, remove_stop_words: bool = True) -> List[str]:
        """
        Tokeniza un texto usando spaCy
        
        Args:
            text: Texto a tokenizar
            remove_stop_words: Si True, remueve stop words
        
        Returns:
            Lista de tokens
        """
        doc = self.nlp(text)
        
        if remove_stop_words:
            tokens = [
                token.text.lower() for token in doc
                if not token.is_stop and not token.is_punct and token.text.strip()
            ]
        else:
            tokens = [
                token.text.lower() for token in doc
                if not token.is_punct and token.text.strip()
            ]
        
        return tokens
    
    def extract_keywords(self, text: str, top_n: int = 10) -> List[str]:
        """
        Extrae keywords más importantes de un texto
        
        Usa lematización de spaCy
        """
        doc = self.nlp(text)
        
        # Extraer lemmas de sustantivos, verbos y adjetivos
        keywords = [
            token.lemma_.lower() for token in doc
            if token.pos_ in ['NOUN', 'VERB', 'ADJ'] and not token.is_stop
        ]
        
        # Retornar únicas, limitado a top_n
        unique_keywords = list(dict.fromkeys(keywords))  # Mantiene orden
        return unique_keywords[:top_n]
    
    def fit_corpus(self, documents: List[str]) -> None:
        """
        Entrena el vectorizador TF-IDF con un corpus de documentos
        
        Args:
            documents: Lista de documentos (preguntas, respuestas, etc.)
        """
        # Normalizar documentos
        normalized_docs = [self.normalize_text(doc) for doc in documents]
        
        # Crear y entrenar vectorizador TF-IDF
        self.vectorizer = TfidfVectorizer(
            max_features=1000,
            ngram_range=(1, 2),  # Unigrams y bigrams
            min_df=1,
            max_df=0.8
        )
        
        self.vectorizer.fit(normalized_docs)
        self._corpus_fitted = True
    
    def calculate_similarity(self, text1: str, text2: str) -> float:
        """
        Calcula similitud semántica entre dos textos usando cosine similarity
        
        Args:
            text1: Primer texto
            text2: Segundo texto
        
        Returns:
            Score de similitud (0-1)
        """
        if not self._corpus_fitted:
            # Si no hay corpus entrenado, usar similitud simple
            return self._simple_similarity(text1, text2)
        
        # Normalizar textos
        text1_norm = self.normalize_text(text1)
        text2_norm = self.normalize_text(text2)
        
        # Vectorizar
        vectors = self.vectorizer.transform([text1_norm, text2_norm])
        
        # Calcular cosine similarity
        similarity = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]
        
        return float(similarity)
    
    def _simple_similarity(self, text1: str, text2: str) -> float:
        """
        Similitud simple basada en palabras en común
        
        Fallback cuando no hay vectorizador entrenado
        """
        tokens1 = set(self.tokenize(self.normalize_text(text1)))
        tokens2 = set(self.tokenize(self.normalize_text(text2)))
        
        if not tokens1 or not tokens2:
            return 0.0
        
        intersection = tokens1.intersection(tokens2)
        union = tokens1.union(tokens2)
        
        # Jaccard similarity
        return len(intersection) / len(union) if union else 0.0
    
    def find_most_similar(self, query: str, candidates: List[str], top_n: int = 5) -> List[Tuple[int, float]]:
        """
        Encuentra los candidatos más similares a una query
        
        Args:
            query: Texto de consulta
            candidates: Lista de textos candidatos
            top_n: Número de resultados a retornar
        
        Returns:
            Lista de tuplas (index, similarity_score) ordenadas por score
        """
        similarities = []
        
        for idx, candidate in enumerate(candidates):
            score = self.calculate_similarity(query, candidate)
            similarities.append((idx, score))
        
        # Ordenar por score descendente
        similarities.sort(key=lambda x: x[1], reverse=True)
        
        return similarities[:top_n]
    
    def is_question(self, text: str) -> bool:
        """
        Detecta si un texto es una pregunta
        """
        text_lower = text.lower().strip()
        
        # Palabras interrogativas en español
        question_words = [
            'qué', 'que', 'cuál', 'cual', 'cuáles', 'cuales',
            'cómo', 'como', 'cuándo', 'cuando', 'dónde', 'donde',
            'por qué', 'por que', 'quién', 'quien', 'quiénes', 'quienes',
            'cuánto', 'cuanto', 'cuánta', 'cuanta', 'cuántos', 'cuantos'
        ]
        
        # Verificar si empieza con palabra interrogativa
        starts_with_question = any(text_lower.startswith(word) for word in question_words)
        
        # Verificar si termina con '?'
        ends_with_question_mark = text.strip().endswith('?')
        
        return starts_with_question or ends_with_question_mark
