"""
NLP Controller - Presentation Layer
Controlador principal para endpoints de NLP.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from application.use_cases.process_message_use_case import ProcessMessageUseCase
from application.use_cases.detect_intent_use_case import DetectIntentUseCase
from application.use_cases.search_knowledge_base_use_case import SearchKnowledgeBaseUseCase
from application.dtos.process_request_dto import (
    ProcessMessageRequestDTO,
    DetectIntentRequestDTO,
    SearchKnowledgeBaseRequestDTO
)
from application.dtos.nlp_response_dto import (
    ProcessMessageResponseDTO,
    DetectIntentResponseDTO,
    SearchKnowledgeBaseResponseDTO,
    ErrorResponseDTO
)
from infrastructure.logging.logger_config import logger
import httpx
import re
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
from config import settings


router = APIRouter(prefix="/api/v1/nlp", tags=["NLP"])


# Dependency injection placeholder - se configura en main.py
_process_message_use_case: ProcessMessageUseCase = None
_detect_intent_use_case: DetectIntentUseCase = None
_search_kb_use_case: SearchKnowledgeBaseUseCase = None


def set_use_cases(
    process_message: ProcessMessageUseCase,
    detect_intent: DetectIntentUseCase,
    search_kb: SearchKnowledgeBaseUseCase
):
    """
    Configura los use cases (llamado desde main.py)
    """
    global _process_message_use_case, _detect_intent_use_case, _search_kb_use_case
    _process_message_use_case = process_message
    _detect_intent_use_case = detect_intent
    _search_kb_use_case = search_kb


def extract_email_from_text(text: str) -> Optional[str]:
    """Extrae email del texto usando regex"""
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    matches = re.findall(email_pattern, text)
    return matches[0] if matches else None


async def send_password_reset_email_direct(to_email: str, user_name: str, session_id: str) -> bool:
    """Envía email de recuperación de contraseña directamente usando SMTP"""
    try:
        logger.info(f"📧 ENVIANDO EMAIL DIRECTO A: {to_email}")
        
        # Configuración SMTP
        smtp_host = os.getenv('SMTP_HOST', 'smtp-relay.brevo.com')
        smtp_port = int(os.getenv('SMTP_PORT', '587'))
        smtp_user = os.getenv('SMTP_USER', 'dragonfaita@gmail.com')
        smtp_password = os.getenv('SMTP_PASSWORD')
        
        logger.info(f"📧 SMTP CONFIG: {smtp_host}:{smtp_port}, user: {smtp_user}")
        
        if not smtp_password:
            logger.error("❌ SMTP_PASSWORD no configurado")
            return False
        
        # Crear mensaje
        msg = MIMEMultipart()
        msg['From'] = f"UPT Chat System <{smtp_user}>"
        msg['To'] = to_email
        msg['Subject'] = "Recuperación de Contraseña - UPT"
        
        API_GATEWAY_BASE_URL = settings.api_gateway_url or "http://localhost:3000"
        reset_url = f"{API_GATEWAY_BASE_URL}/api/v1/password-reset/confirm/{session_id}"
        
        html_body = f"""
        <html>
        <body>
        <h2>Recuperación de Contraseña - UPT</h2>
        <p>Hola {user_name},</p>
        <p>Recibimos una solicitud para recuperar tu contraseña.</p>
        <p>Haz clic en el siguiente enlace para continuar:</p>
        <p><a href="{reset_url}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Recuperar Contraseña</a></p>
        <p>Si no solicitaste este cambio, ignora este mensaje.</p>
        <p>Saludos,<br>Equipo UPT</p>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(html_body, 'html'))
        
        # Enviar email
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.send_message(msg)
        
        logger.info(f"✅ EMAIL ENVIADO EXITOSAMENTE A {to_email}")
        return True
        
    except Exception as e:
        logger.error(f"❌ ERROR ENVIANDO EMAIL DIRECTO: {str(e)}")
        return False


@router.post(
    "/process",
    response_model=ProcessMessageResponseDTO,
    status_code=status.HTTP_200_OK,
    summary="Procesar mensaje del usuario",
    description="Procesa un mensaje del usuario y genera una respuesta inteligente"
)
async def process_message(request: ProcessMessageRequestDTO):
    """
    Endpoint principal para procesar mensajes
    
    Flujo:
    1. Detecta si es recuperación de contraseña
    2. Si es email, procesa directamente
    3. Si no, procesa normalmente con NLP
    """
    try:
        logger.info(f"🔍 PROCESSING MESSAGE from session {request.session_id}")
        logger.info(f"🔍 MESSAGE TEXT: '{request.message}'")
        
        message_lower = request.message.lower().strip()
        
        # ===================================================================
        # CASO 1: Detectar "Olvidé mi contraseña"
        # ===================================================================
        is_password_recovery = any(keyword in message_lower for keyword in [
            'olvidé mi contraseña', 'olvide mi contraseña', 
            'olvidé contraseña', 'olvide contraseña',
            'recuperar contraseña', 'recuperar password',
            'resetear contraseña', 'cambiar contraseña',
            'password recovery', 'forgot password'
        ])
        
        if is_password_recovery:
            logger.info("🔐 DETECTADO: Solicitud de recuperación de contraseña")
            
            # Intentar extraer email del mensaje
            email = extract_email_from_text(request.message)
            
            if email:
                logger.info(f"✅ EMAIL DETECTADO EN MENSAJE: {email}")
                # Procesar recuperación con email
                return await handle_password_recovery_with_email(email, request.session_id)
            else:
                logger.info("📧 Email no encontrado, pidiendo al usuario")
                return ProcessMessageResponseDTO(
                    session_id=request.session_id,
                    response="Para ayudarte a recuperar tu contraseña, necesito tu correo electrónico institucional o personal registrado en la UPT. Por favor, escríbelo.",
                    intent={"name": "Password Recovery", "id": "password_recovery"},
                    confidence=1.0,
                    suggestions=None,
                    timestamp="",
                    requires_validation=True,
                    validation_state="awaiting_email"
                )
        
        # ===================================================================
        # CASO 2: Usuario da solo un email (posible respuesta a solicitud)
        # ===================================================================
        email_only = extract_email_from_text(request.message)
        if email_only and len(request.message.split()) <= 3:
            logger.info(f"📧 EMAIL DETECTADO SOLO: {email_only}")
            logger.info("🔍 Verificando si es respuesta a recuperación de contraseña...")
            
            # Procesar como recuperación de contraseña
            return await handle_password_recovery_with_email(email_only, request.session_id)
        
        # ===================================================================
        # CASO 3: Procesamiento normal con NLP
        # ===================================================================
        if not _process_message_use_case:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Service not initialized"
            )
        
        response = await _process_message_use_case.execute(request)
        
        logger.info(f"✅ MESSAGE PROCESSED:")
        logger.info(f"   - Intent: {response.intent.id if response.intent else 'None'}")
        logger.info(f"   - Confidence: {response.confidence}")
        logger.info(f"   - Response: '{response.response[:100]}...'")
        
        return response
        
    except Exception as e:
        logger.error(f"Error processing message: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing message: {str(e)}"
        )


async def handle_password_recovery_with_email(email: str, session_id: str) -> ProcessMessageResponseDTO:
    """Maneja la recuperación de contraseña con email"""
    try:
        logger.info(f"🔍 VERIFICANDO EMAIL: {email}")
        
        # Verificar email en API Gateway
        API_GATEWAY_BASE_URL = settings.api_gateway_url or "http://localhost:3000"
        
        async with httpx.AsyncClient(timeout=15.0) as client:
            verify_url = f"{API_GATEWAY_BASE_URL}/api/v1/users/verify-email"
            logger.info(f"📡 Llamando a: {verify_url}")
            
            try:
                verify_response = await client.post(
                    verify_url,
                    json={"email": email}
                )
                verify_response.raise_for_status()
                result = verify_response.json()
                logger.info(f"✅ Respuesta API Gateway: {result}")
                
            except httpx.HTTPError as e:
                logger.error(f"❌ Error llamando API Gateway: {str(e)}")
                return ProcessMessageResponseDTO(
                    session_id=session_id,
                    response="Disculpa, hay un problema técnico. Por favor intenta más tarde.",
                    intent={"name": "Error", "id": "error"},
                    confidence=1.0,
                    suggestions=None,
                    timestamp=""
                )
        
        # Procesar resultado
        if result.get("exists"):
            user_id = result.get("user_id", "")
            nombre_completo = result.get("name", "Usuario")
            
            logger.info(f"✅ Email encontrado - Usuario: {user_id} ({nombre_completo})")
            
            # Enviar email directamente
            logger.info(f"📧 ENVIANDO EMAIL DIRECTO (bypass API Gateway)...")
            
            email_sent = await send_password_reset_email_direct(
                to_email=email,
                user_name=nombre_completo,
                session_id=session_id
            )
            
            if email_sent:
                logger.info(f"✅ EMAIL ENVIADO EXITOSAMENTE")
                
                return ProcessMessageResponseDTO(
                    session_id=session_id,
                    response=f"Perfecto, {nombre_completo}. He enviado un correo electrónico a {email} con las instrucciones para recuperar tu contraseña. Por favor revisa tu bandeja de entrada y sigue los pasos indicados. Si no recibes el correo en unos minutos, revisa tu carpeta de spam.",
                    intent={"name": "Password Recovery Success", "id": "password_recovery_success"},
                    confidence=1.0,
                    suggestions=None,
                    timestamp=""
                )
            else:
                logger.error(f"❌ ERROR ENVIANDO EMAIL")
                return ProcessMessageResponseDTO(
                    session_id=session_id,
                    response="Hubo un problema al enviar el correo de recuperación. Por favor intenta nuevamente más tarde.",
                    intent={"name": "Password Recovery Error", "id": "password_recovery_error"},
                    confidence=1.0,
                    suggestions=None,
                    timestamp=""
                )
        else:
            logger.warning(f"❌ Email no encontrado: {email}")
            return ProcessMessageResponseDTO(
                session_id=session_id,
                response=f"Lo siento, el correo electrónico {email} no está registrado en nuestro sistema. ¿Quieres intentar con otro correo?",
                intent={"name": "Email Not Found", "id": "email_not_found"},
                confidence=1.0,
                suggestions=None,
                timestamp="",
                requires_validation=True,
                validation_state="awaiting_email"
            )
    
    except Exception as e:
        logger.error(f"❌ Error en handle_password_recovery_with_email: {str(e)}", exc_info=True)
        return ProcessMessageResponseDTO(
            session_id=session_id,
            response="Disculpa, ocurrió un error al procesar tu solicitud. Por favor intenta nuevamente.",
            intent={"name": "Error", "id": "error"},
            confidence=1.0,
            suggestions=None,
            timestamp=""
        )


@router.post(
    "/detect-intent",
    response_model=DetectIntentResponseDTO,
    status_code=status.HTTP_200_OK,
    summary="Detectar intent",
    description="Detecta el intent de un mensaje sin generar respuesta completa"
)
async def detect_intent(request: DetectIntentRequestDTO):
    """
    Endpoint para detectar solo el intent
    
    Útil para:
    - Testing y debugging
    - Análisis de mensajes
    - Métricas de detección
    """
    try:
        logger.debug(f"Detecting intent for message: {request.message[:50]}...")
        
        if not _detect_intent_use_case:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Service not initialized"
            )
        
        response = await _detect_intent_use_case.execute(request)
        
        logger.debug(f"Intent detected: {response.intent.id if response.intent else 'None'}")
        
        return response
        
    except Exception as e:
        logger.error(f"Error detecting intent: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error detecting intent: {str(e)}"
        )


@router.post(
    "/search",
    response_model=SearchKnowledgeBaseResponseDTO,
    status_code=status.HTTP_200_OK,
    summary="Buscar en knowledge base",
    description="Busca directamente en la base de conocimientos"
)
async def search_knowledge_base(request: SearchKnowledgeBaseRequestDTO):
    """
    Endpoint para búsqueda directa en la KB
    
    No requiere detección de intent, busca por similitud semántica.
    """
    try:
        logger.debug(f"Searching KB for: {request.query}")
        
        if not _search_kb_use_case:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Service not initialized"
            )
        
        response = await _search_kb_use_case.execute(request)
        
        logger.debug(f"Found {response.total_found} results")
        
        return response
        
    except Exception as e:
        logger.error(f"Error searching KB: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error searching knowledge base: {str(e)}"
        )


@router.get(
    "/health",
    status_code=status.HTTP_200_OK,
    summary="Health check del servicio NLP"
)
async def health_check():
    """
    Verifica el estado del servicio
    """
    return {
        "status": "healthy",
        "service": "nlp-service",
        "version": "1.0.0"
    }
