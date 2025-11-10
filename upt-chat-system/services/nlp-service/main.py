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
from presentation.controllers.dialogflow_controller import router as dialogflow_router, set_dialogflow_service
from presentation.controllers.webhook_controller import router as webhook_router
from presentation.middleware.error_handler import (
    validation_exception_handler,
    http_exception_handler,
    general_exception_handler
)

from infrastructure.repositories.json_intent_repository import JsonIntentRepository
from infrastructure.repositories.json_knowledge_base_repository import JsonKnowledgeBaseRepository
from infrastructure.nlp.nlp_engine_initializer import NLPEngineInitializer
from infrastructure.nlp.dialogflow_service import DialogFlowService
from infrastructure.nlp.hybrid_nlp_service import HybridNLPService
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
    # DialogFlow components
    dialogflow_service: DialogFlowService = None
    hybrid_nlp_service: HybridNLPService = None


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
        
        # 3. Inicializar DialogFlow (si está habilitado)
        logger.info(f"🔍 DIALOGFLOW CONFIG:")
        logger.info(f"   - use_dialogflow: {settings.use_dialogflow}")
        logger.info(f"   - project_id: {settings.google_project_id}")
        logger.info(f"   - credentials_path: {settings.google_credentials_path}")
        logger.info(f"   - has_env_vars: {bool(settings.google_client_email)}")
        
        if settings.use_dialogflow:
            try:
                logger.info("🚀 Initializing DialogFlow service...")
                
                # Método 1: Usar variables de entorno individuales (para Railway)
                if settings.google_client_email and settings.google_private_key:
                    logger.info("� Using environment variables to create credentials")
                    import json
                    import os
                    
                    # Crear JSON de credenciales dinámicamente
                    credentials_data = {
                        "type": "service_account",
                        "project_id": settings.google_project_id,
                        "private_key_id": settings.google_private_key_id,
                        "private_key": settings.google_private_key.replace('\\n', '\n'),  # Convertir saltos de línea
                        "client_email": settings.google_client_email,
                        "client_id": settings.google_client_id,
                        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                        "token_uri": "https://oauth2.googleapis.com/token",
                        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                        "client_x509_cert_url": f"https://www.googleapis.com/robot/v1/metadata/x509/{settings.google_client_email.replace('@', '%40')}",
                        "universe_domain": "googleapis.com"
                    }
                    
                    # Crear directorio y archivo temporal
                    os.makedirs('credentials', exist_ok=True)
                    credentials_path = 'credentials/dialogflow-credentials-env.json'
                    
                    with open(credentials_path, 'w') as f:
                        json.dump(credentials_data, f, indent=2)
                    
                    logger.info(f"✅ Credentials created from env vars: {credentials_path}")
                
                # Método 2: Usar archivo local (para desarrollo)
                else:
                    credentials_path = settings.google_credentials_path
                    logger.info(f"📁 Using file credentials: {credentials_path}")
                
                container.dialogflow_service = DialogFlowService(
                    project_id=settings.google_project_id,
                    credentials_path=credentials_path,
                    language_code=settings.dialogflow_language_code
                )
                logger.info("✅ DialogFlow service ready!")
                
            except Exception as e:
                logger.error(f"❌ DialogFlow initialization failed: {str(e)}")
                logger.error(f"❌ Exception type: {type(e).__name__}")
                import traceback
                logger.error(f"❌ Full traceback: {traceback.format_exc()}")
                logger.info("📋 Continuing with local NLP only...")
                container.dialogflow_service = None
        
        # 4. Inicializar servicios de dominio
        logger.info("Initializing domain services...")
        container.context_manager = ContextManagerService()
        container.nlp_service = NLPDomainService(
            container.intent_repository,
            container.kb_repository
        )
        
        # 5. Inicializar servicio híbrido NLP
        container.hybrid_nlp_service = HybridNLPService(
            dialogflow_service=container.dialogflow_service,
            nlp_engine=nlp_engine,
            use_dialogflow=settings.use_dialogflow
        )
        logger.info("✅ Domain services ready")
        
        # 6. Inicializar casos de uso
        logger.info("Initializing use cases...")
        container.process_message_use_case = ProcessMessageUseCase(
            container.hybrid_nlp_service,
            container.context_manager
        )
        container.detect_intent_use_case = DetectIntentUseCase(
            container.hybrid_nlp_service
        )
        container.search_kb_use_case = SearchKnowledgeBaseUseCase(
            container.hybrid_nlp_service
        )
        logger.info("✅ Use cases ready")
        
        # 7. Configurar controladores con use cases
        set_use_cases(
            container.process_message_use_case,
            container.detect_intent_use_case,
            container.search_kb_use_case
        )
        
        # 8. Configurar controlador DialogFlow
        if container.dialogflow_service:
            set_dialogflow_service(container.dialogflow_service)
            logger.info("✅ DialogFlow controller configured")
        
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
    allow_origins=settings.get_cors_origins,
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
app.include_router(dialogflow_router)
app.include_router(webhook_router)  # Webhook para DialogFlow RF004


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
