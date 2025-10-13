"""
Cliente HTTP para comunicarse con el API Gateway.
Implementa RF004 - Validación por Correo Personal
"""
import httpx
import logging
from typing import Dict, Optional
import os


logger = logging.getLogger(__name__)


class ApiGatewayClient:
    """Cliente para comunicarse con el API Gateway del sistema."""
    
    def __init__(self):
        """Inicializa el cliente con la URL del API Gateway."""
        self.base_url = os.getenv("API_GATEWAY_URL", "http://localhost:3000")
        self.timeout = 30.0
        
    async def verify_email(self, email: str) -> Dict:
        """
        Verifica si un correo electrónico existe en el sistema UPT.
        
        Args:
            email: Correo electrónico a verificar
            
        Returns:
            Dict con 'exists' (bool), 'user_id' (Optional[str]), 'name' (Optional[str])
        """
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.base_url}/api/users/verify-email",
                    json={"email": email}
                )
                
                if response.status_code == 200:
                    return response.json()
                else:
                    logger.error(f"Error al verificar email: {response.status_code}")
                    return {"exists": False}
                    
        except Exception as e:
            logger.error(f"Error en verify_email: {str(e)}")
            return {"exists": False, "error": str(e)}
    
    async def initiate_password_reset(self, email: str, session_id: str) -> Dict:
        """
        Inicia el proceso de recuperación de contraseña.
        
        Args:
            email: Correo electrónico del usuario
            session_id: ID de la sesión del chat
            
        Returns:
            Dict con 'success' (bool), 'token' (Optional[str]), 'message' (str)
        """
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.base_url}/api/password-reset/initiate",
                    json={
                        "email": email,
                        "session_id": session_id
                    }
                )
                
                if response.status_code == 200 or response.status_code == 201:
                    return response.json()
                else:
                    logger.error(f"Error al iniciar reset: {response.status_code}")
                    return {
                        "success": False, 
                        "message": "Error al procesar la solicitud"
                    }
                    
        except Exception as e:
            logger.error(f"Error en initiate_password_reset: {str(e)}")
            return {
                "success": False,
                "message": f"Error de conexión: {str(e)}"
            }
    
    async def check_validation_status(self, session_id: str) -> Dict:
        """
        Verifica el estado de una validación de correo.
        
        Args:
            session_id: ID de la sesión del chat
            
        Returns:
            Dict con información del estado de validación
        """
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(
                    f"{self.base_url}/api/password-reset/status/{session_id}"
                )
                
                if response.status_code == 200:
                    return response.json()
                else:
                    return {"status": "unknown"}
                    
        except Exception as e:
            logger.error(f"Error en check_validation_status: {str(e)}")
            return {"status": "error", "error": str(e)}
    
    async def notify_user_response(self, session_id: str, message: str) -> bool:
        """
        Notifica al API Gateway sobre una respuesta para el usuario.
        
        Args:
            session_id: ID de la sesión
            message: Mensaje a enviar al usuario
            
        Returns:
            True si la notificación fue exitosa
        """
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.base_url}/api/notifications/session/{session_id}",
                    json={"message": message}
                )
                
                return response.status_code in [200, 201]
                
        except Exception as e:
            logger.error(f"Error en notify_user_response: {str(e)}")
            return False
