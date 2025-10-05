"""
Error Handler Middleware - Presentation Layer
Middleware para manejo centralizado de errores.
"""
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from infrastructure.logging.logger_config import logger
from datetime import datetime


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Maneja errores de validación de Pydantic
    """
    logger.warning(f"Validation error: {exc.errors()}")
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "ValidationError",
            "message": "Error de validación en los datos enviados",
            "details": exc.errors(),
            "timestamp": datetime.now().isoformat()
        }
    )


async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """
    Maneja HTTPException de FastAPI
    """
    logger.error(f"HTTP error {exc.status_code}: {exc.detail}")
    
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": f"HTTPError{exc.status_code}",
            "message": str(exc.detail),
            "timestamp": datetime.now().isoformat()
        }
    )


async def general_exception_handler(request: Request, exc: Exception):
    """
    Maneja excepciones no capturadas
    """
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "InternalServerError",
            "message": "Error interno del servidor",
            "details": str(exc),
            "timestamp": datetime.now().isoformat()
        }
    )
