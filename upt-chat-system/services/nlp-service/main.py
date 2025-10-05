"""
Main Application - NLP Service
Punto de entrada de la aplicación FastAPI.
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from contextlib import asynccontextmanager

from presentation.controllers.nlp_controller import router as nlp_router, set_use_cases
from presentation.controllers.admin_controller import router as admin_router
from presentation.middleware.error_handler import (
    validation_exception_handler,
    http_exception_handler,
    general_exception_handler
)

from infrastructure.repositories.json_intent_repository import JsonIntentRepository
from infrastructure.repositories.json_knowledge_base_repository import JsonKnowledgeBaseRepository
from infrastructure.nlp.nlp_engine_initializer import NLPEngineInitializer
from infrastructure.logging.logger_config import logger

from domain.services.nlp_domain_service import NLPDomainService
from domain.services.context_manager_service import ContextManagerService

from application.use_cases.process_message_use_case import ProcessMessageUseCase
from application.use_cases.detect_intent_use_case import DetectIntentUseCase
from application.use_cases.search_knowledge_base_use_case import SearchKnowledgeBaseUseCase

from config import settings


# Contenedor de dependencias global
class DependencyContainer:
    """Contenedor simple de dependencias (DI)"""
    intent_repository: JsonIntentRepository = None
    kb_repository: JsonKnowledgeBaseRepository = None
    nlp_service: NLPDomainService = None
    context_manager: ContextManagerService = None
    process_message_use_case: ProcessMessageUseCase = None
    detect_intent_use_case: DetectIntentUseCase = None
    search_kb_use_case: SearchKnowledgeBaseUseCase = None


container = DependencyContainer()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifecycle events: inicialización y limpieza
    """
    # Startup
    logger.info("🚀 Starting NLP Service...")
    
    try:
        # 1. Inicializar repositorios
        logger.info("Loading data repositories...")
        container.intent_repository = JsonIntentRepository(
            data_path=settings.intents_data_path
        )
        container.kb_repository = JsonKnowledgeBaseRepository(
            data_path=settings.faqs_data_path
        )
        logger.info("✅ Repositories loaded successfully")
        
        # 2. Inicializar NLP Engine
        logger.info("Initializing NLP engine...")
        nlp_engine = await NLPEngineInitializer.initialize(
            container.kb_repository,
            model_name=settings.spacy_model
        )
        logger.info("✅ NLP engine initialized")
        
        # 3. Inicializar servicios de dominio
        logger.info("Initializing domain services...")
        container.context_manager = ContextManagerService()
        container.nlp_service = NLPDomainService(
            container.intent_repository,
            container.kb_repository
        )
        logger.info("✅ Domain services ready")
        
        # 4. Inicializar casos de uso
        logger.info("Initializing use cases...")
        container.process_message_use_case = ProcessMessageUseCase(
            container.nlp_service,
            container.context_manager
        )
        container.detect_intent_use_case = DetectIntentUseCase(
            container.nlp_service
        )
        container.search_kb_use_case = SearchKnowledgeBaseUseCase(
            container.nlp_service
        )
        logger.info("✅ Use cases ready")
        
        # 5. Configurar controladores con use cases
        set_use_cases(
            container.process_message_use_case,
            container.detect_intent_use_case,
            container.search_kb_use_case
        )
        
        logger.info("✅ NLP Service started successfully!")
        logger.info(f"📍 Environment: {settings.environment}")
        logger.info(f"📍 Port: {settings.port}")
        
        yield
        
    except Exception as e:
        logger.error(f"❌ Failed to start service: {str(e)}", exc_info=True)
        raise
    
    # Shutdown
    logger.info("🔄 Shutting down NLP Service...")
    logger.info("✅ Shutdown complete")


# Crear aplicación FastAPI
app = FastAPI(
    title="UPT NLP Service",
    description="Servicio de procesamiento NLP para chatbot UPT",
    version="1.0.0",
    lifespan=lifespan
)

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)

# Registrar routers
app.include_router(nlp_router)
app.include_router(admin_router)


@app.get("/", tags=["Root"])
async def root():
    """
    Endpoint raíz
    """
    return {
        "service": "UPT NLP Service",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
        "health": "/api/v1/nlp/health"
    }


@app.get("/health", tags=["Health"])
async def health():
    """
    Health check simplificado
    """
    return {
        "status": "healthy",
        "service": "nlp-service"
    }


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level=settings.log_level.lower()
    )
