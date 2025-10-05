"""
Configuration - NLP Service
Configuración centralizada usando Pydantic Settings.
"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """
    Configuración de la aplicación
    """
    # Aplicación
    app_name: str = "UPT NLP Service"
    environment: str = "development"
    debug: bool = True
    
    # Server
    host: str = "0.0.0.0"
    port: int = 8001
    
    # Logging
    log_level: str = "INFO"
    log_file: str = "logs/nlp-service.log"
    
    # CORS
    cors_origins: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:4000",
        "http://localhost:5173"
    ]
    
    # Data paths
    intents_data_path: str = "data/intents.json"
    faqs_data_path: str = "data/faqs.json"
    
    # NLP
    spacy_model: str = "es_core_news_sm"
    
    # Confidence thresholds
    min_confidence: float = 0.6
    high_confidence: float = 0.8
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


# Instancia global de settings
settings = Settings()
