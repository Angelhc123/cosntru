"""
Confidence Value Object - Domain Layer
Representa un score de confianza (0.0 - 1.0) con validaciones.
"""
from dataclasses import dataclass
from enum import Enum


class ConfidenceLevel(Enum):
    """Niveles de confianza"""
    VERY_LOW = "very_low"      # 0.0 - 0.3
    LOW = "low"                # 0.3 - 0.5
    MEDIUM = "medium"          # 0.5 - 0.7
    HIGH = "high"              # 0.7 - 0.9
    VERY_HIGH = "very_high"    # 0.9 - 1.0


@dataclass(frozen=True)
class Confidence:
    """
    Value Object para Confidence Score
    
    Inmutable, validado, representa un score de confianza.
    """
    
    value: float
    
    def __post_init__(self):
        """Validaciones de negocio"""
        if not isinstance(self.value, (int, float)):
            raise ValueError("Confidence value must be a number")
        
        if self.value < 0.0 or self.value > 1.0:
            raise ValueError("Confidence value must be between 0.0 and 1.0")
    
    @classmethod
    def from_percentage(cls, percentage: float) -> 'Confidence':
        """
        Crea Confidence desde un porcentaje (0-100)
        """
        if percentage < 0 or percentage > 100:
            raise ValueError("Percentage must be between 0 and 100")
        return cls(percentage / 100.0)
    
    def to_percentage(self) -> float:
        """
        Convierte a porcentaje (0-100)
        """
        return self.value * 100.0
    
    def get_level(self) -> ConfidenceLevel:
        """
        Retorna el nivel de confianza
        """
        if self.value < 0.3:
            return ConfidenceLevel.VERY_LOW
        elif self.value < 0.5:
            return ConfidenceLevel.LOW
        elif self.value < 0.7:
            return ConfidenceLevel.MEDIUM
        elif self.value < 0.9:
            return ConfidenceLevel.HIGH
        else:
            return ConfidenceLevel.VERY_HIGH
    
    def is_acceptable(self, threshold: float = 0.6) -> bool:
        """
        Verifica si el confidence supera un threshold
        """
        return self.value >= threshold
    
    def is_high_confidence(self) -> bool:
        """
        Verifica si es alta confianza (>= 0.7)
        """
        return self.value >= 0.7
    
    def __str__(self) -> str:
        return f"{self.to_percentage():.1f}%"
    
    def __repr__(self) -> str:
        return f"Confidence({self.value:.2f})"
    
    def __float__(self) -> float:
        return self.value
    
    def __eq__(self, other) -> bool:
        if isinstance(other, Confidence):
            return abs(self.value - other.value) < 0.001
        return False
    
    def __lt__(self, other) -> bool:
        if isinstance(other, Confidence):
            return self.value < other.value
        raise TypeError(f"Cannot compare Confidence with {type(other)}")
    
    def __le__(self, other) -> bool:
        return self < other or self == other
    
    def __gt__(self, other) -> bool:
        if isinstance(other, Confidence):
            return self.value > other.value
        raise TypeError(f"Cannot compare Confidence with {type(other)}")
    
    def __ge__(self, other) -> bool:
        return self > other or self == other
