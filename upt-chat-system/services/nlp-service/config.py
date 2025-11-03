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
    
    # Account
    admin_email: str = "angelxhernandezxcruz@gmail.com"
    
    # Server
    host: str = "0.0.0.0"
    port: int = 8001
    
    # Logging
    log_level: str = "INFO"
    log_file: str = "logs/nlp-service.log"
    
    # CORS
    cors_origins: str = "http://localhost:3000,http://localhost:3001,http://localhost:4000,http://localhost:5173"
    
    @property
    def get_cors_origins(self) -> List[str]:
        """Convierte el string de CORS a lista"""
        return [origin.strip() for origin in self.cors_origins.split(",")]
    
    # Data paths
    intents_data_path: str = "data/intents.json"
    faqs_data_path: str = "data/faqs.json"
    
    # NLP Local (fallback)
    spacy_model: str = "es_core_news_sm"
    
    # DialogFlow Configuration
    use_dialogflow: bool = True
    google_project_id: str = "upt-chat-fhps"
    google_credentials_path: str = "credentials/dialogflow-credentials.json"
    dialogflow_session_path: str = ""
    dialogflow_language_code: str = "es"
    
    # API Gateway Configuration (for RF004 webhook)
    api_gateway_url: str = "http://localhost:3000"
    
    # Confidence thresholds
    min_confidence: float = 0.6
    high_confidence: float = 0.8
    dialogflow_confidence_threshold: float = 0.7
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"  # Permitir campos extra sin error


# Instancia global de settings
settings = Settings()
