"""
Message Value Object - Domain Layer
Representa un mensaje procesado y normalizado.
"""
from dataclasses import dataclass
from typing import List
import unicodedata
import re


@dataclass(frozen=True)
class Message:
    """
    Value Object para Message
    
    Inmutable, representa un mensaje de texto normalizado y procesado.
    """
    
    original_text: str
    normalized_text: str
    tokens: List[str]
    
    def __post_init__(self):
        """Validaciones de negocio"""
        if not self.original_text or not self.original_text.strip():
            raise ValueError("Message text cannot be empty")
        
        if not self.normalized_text or not self.normalized_text.strip():
            raise ValueError("Normalized text cannot be empty")
        
        if not self.tokens or len(self.tokens) == 0:
            raise ValueError("Message must have at least one token")
    
    @classmethod
    def create(cls, text: str, stop_words: List[str] = None) -> 'Message':
        """
        Factory method para crear Message desde texto raw
        """
        if not text or not text.strip():
            raise ValueError("Cannot create Message from empty text")
        
        normalized = cls._normalize_text(text)
        tokens = cls._tokenize(normalized, stop_words or [])
        
        return cls(
            original_text=text.strip(),
            normalized_text=normalized,
            tokens=tokens
        )
    
    @staticmethod
    def _normalize_text(text: str) -> str:
        """
        Normaliza texto:
        - Lowercase
        - Remueve acentos
        - Remueve caracteres especiales
        - Normaliza espacios
        """
        # Lowercase
        text = text.lower()
        
        # Remover acentos
        text = ''.join(
            c for c in unicodedata.normalize('NFD', text)
            if unicodedata.category(c) != 'Mn'
        )
        
        # Remover caracteres especiales excepto espacios
        text = re.sub(r'[^a-z0-9\s]', ' ', text)
        
        # Normalizar espacios múltiples
        text = re.sub(r'\s+', ' ', text)
        
        return text.strip()
    
    @staticmethod
    def _tokenize(text: str, stop_words: List[str]) -> List[str]:
        """
        Tokeniza texto en palabras, removiendo stop words
        """
        tokens = text.split()
        
        # Remover stop words
        if stop_words:
            stop_words_lower = [sw.lower() for sw in stop_words]
            tokens = [t for t in tokens if t not in stop_words_lower]
        
        # Remover tokens muy cortos (< 2 caracteres)
        tokens = [t for t in tokens if len(t) >= 2]
        
        return tokens
    
    def contains_word(self, word: str) -> bool:
        """
        Verifica si el mensaje contiene una palabra específica
        """
        word_normalized = self._normalize_text(word)
        return word_normalized in self.normalized_text
    
    def contains_any_word(self, words: List[str]) -> bool:
        """
        Verifica si el mensaje contiene alguna de las palabras
        """
        return any(self.contains_word(word) for word in words)
    
    def get_word_count(self) -> int:
        """
        Retorna el número de tokens
        """
        return len(self.tokens)
    
    def is_short(self, threshold: int = 3) -> bool:
        """
        Verifica si el mensaje es corto
        """
        return len(self.tokens) <= threshold
    
    def is_question(self) -> bool:
        """
        Verifica si el mensaje parece ser una pregunta
        """
        question_words = ['que', 'quien', 'cuando', 'donde', 'como', 'cual', 'por que', 'cuanto']
        return (
            self.original_text.strip().endswith('?') or
            self.contains_any_word(question_words)
        )
    
    def __str__(self) -> str:
        return self.original_text
    
    def __repr__(self) -> str:
        return f"Message('{self.original_text[:30]}...', tokens={len(self.tokens)})"
    
    def __len__(self) -> int:
        return len(self.original_text)
