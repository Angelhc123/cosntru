"""
Logging Configuration - Infrastructure Layer
Configuración de logging para el servicio NLP.
"""
import logging
import sys
from typing import Optional
from pathlib import Path


class LoggerConfig:
    """
    Configuración centralizada de logging
    """
    
    @staticmethod
    def setup_logger(
        name: str = "nlp-service",
        level: str = "INFO",
        log_file: Optional[str] = None
    ) -> logging.Logger:
        """
        Configura y retorna un logger
        
        Args:
            name: Nombre del logger
            level: Nivel de logging (DEBUG, INFO, WARNING, ERROR, CRITICAL)
            log_file: Path opcional para archivo de logs
        
        Returns:
            Logger configurado
        """
        logger = logging.getLogger(name)
        logger.setLevel(getattr(logging, level.upper()))
        
        # Evitar duplicación de handlers
        if logger.handlers:
            return logger
        
        # Formato de logs
        formatter = logging.Formatter(
            fmt='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        
        # Handler para consola
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(logging.DEBUG)
        console_handler.setFormatter(formatter)
        logger.addHandler(console_handler)
        
        # Handler para archivo (opcional)
        if log_file:
            log_path = Path(log_file)
            log_path.parent.mkdir(parents=True, exist_ok=True)
            
            file_handler = logging.FileHandler(log_file, encoding='utf-8')
            file_handler.setLevel(logging.DEBUG)
            file_handler.setFormatter(formatter)
            logger.addHandler(file_handler)
        
        return logger


# Logger global para el servicio
logger = LoggerConfig.setup_logger()
