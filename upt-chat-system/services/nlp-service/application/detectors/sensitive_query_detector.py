"""
Detector de consultas sensibles que requieren validación por correo.
Implementa RF004 - Validación por Correo Personal
"""
from typing import Dict, Optional
import re


class SensitiveQueryDetector:
    """
    Detecta si una consulta del usuario requiere validación de identidad
    mediante correo electrónico personal.
    """
    
    # Palabras clave que indican consultas sensibles
    SENSITIVE_KEYWORDS = [
        # Contraseñas
        r"olvid[eéó]\s+(mi\s+)?contrase[ñn]a",
        r"recuperar\s+contrase[ñn]a",
        r"restablecer\s+contrase[ñn]a",
        r"cambiar\s+contrase[ñn]a",
        r"no\s+(me\s+)?acuerdo\s+(de\s+)?(mi\s+)?contrase[ñn]a",
        r"perdi\s+(mi\s+)?contrase[ñn]a",
        
        # NOTA: Horario, Notas y Asistencia YA NO requieren validación
        # Ahora simplemente redirigen a la intranet
        
        # Pagos personales
        r"mis\s+pagos",
        r"mi\s+deuda",
        r"cu[aá]nto\s+debo",
        r"estado\s+de\s+cuenta",
        
        # Trámites personales
        r"mis\s+tr[aá]mites",
        r"estado\s+de\s+(mi\s+)?tr[aá]mite",
        r"seguimiento\s+de\s+tr[aá]mite",
    ]
    
    def __init__(self):
        """Inicializa el detector compilando los patrones regex."""
        self.patterns = [re.compile(pattern, re.IGNORECASE) 
                        for pattern in self.SENSITIVE_KEYWORDS]
    
    def is_sensitive_query(self, message: str) -> bool:
        """
        Determina si un mensaje contiene una consulta sensible.
        
        Args:
            message: Mensaje del usuario
            
        Returns:
            True si es una consulta sensible, False en caso contrario
        """
        message_lower = message.lower().strip()
        
        for pattern in self.patterns:
            if pattern.search(message_lower):
                return True
        
        return False
    
    def get_sensitive_category(self, message: str) -> Optional[str]:
        """
        Identifica la categoría de información sensible solicitada.
        
        Args:
            message: Mensaje del usuario
            
        Returns:
            Categoría de la consulta ('password', 'grades', 'academic', 'payments', 'procedures')
            o None si no es sensible
        """
        message_lower = message.lower().strip()
        
        # Contraseñas
        password_patterns = [
            r"olvid[eéó]\s+(mi\s+)?contrase[ñn]a",
            r"recuperar\s+contrase[ñn]a",
            r"restablecer\s+contrase[ñn]a",
            r"cambiar\s+contrase[ñn]a",
            r"perdi\s+(mi\s+)?contrase[ñn]a",
        ]
        for pattern in password_patterns:
            if re.search(pattern, message_lower):
                return 'password'
        
        # Notas/Calificaciones - DESACTIVADO: ahora solo redirige
        # grades_patterns = [
        #     r"mis\s+notas",
        #     r"mis\s+calificaciones",
        #     r"consultar\s+notas",
        #     r"ver\s+(mis\s+)?notas",
        # ]
        # for pattern in grades_patterns:
        #     if re.search(pattern, message_lower):
        #         return 'grades'
        
        # Información académica - DESACTIVADO: ahora solo redirige
        # academic_patterns = [
        #     r"mi\s+horario",
        #     r"mis\s+cursos",
        #     r"mi\s+record\s+acad[eé]mico",
        #     r"mi\s+historial\s+acad[eé]mico",
        # ]
        # for pattern in academic_patterns:
        #     if re.search(pattern, message_lower):
        #         return 'academic'
        
        # Pagos
        payments_patterns = [
            r"mis\s+pagos",
            r"mi\s+deuda",
            r"cu[aá]nto\s+debo",
            r"estado\s+de\s+cuenta",
        ]
        for pattern in payments_patterns:
            if re.search(pattern, message_lower):
                return 'payments'
        
        # Trámites
        procedures_patterns = [
            r"mis\s+tr[aá]mites",
            r"estado\s+de\s+(mi\s+)?tr[aá]mite",
            r"seguimiento\s+de\s+tr[aá]mite",
        ]
        for pattern in procedures_patterns:
            if re.search(pattern, message_lower):
                return 'procedures'
        
        return None
    
    def get_validation_prompt(self, category: str) -> str:
        """
        Obtiene el mensaje apropiado para solicitar validación según la categoría.
        
        Args:
            category: Categoría de consulta sensible
            
        Returns:
            Mensaje para solicitar validación al usuario
        """
        prompts = {
            'password': (
                "Para ayudarte a recuperar tu contraseña, necesito validar tu identidad. "
                "Por favor, proporciona tu correo electrónico institucional o personal registrado en la UPT."
            ),
            'grades': (
                "Para consultar tus notas, necesito validar tu identidad. "
                "Por favor, proporciona tu correo electrónico institucional o personal registrado en la UPT."
            ),
            'academic': (
                "Para acceder a tu información académica personal, necesito validar tu identidad. "
                "Por favor, proporciona tu correo electrónico institucional o personal registrado en la UPT."
            ),
            'payments': (
                "Para consultar tu información de pagos, necesito validar tu identidad. "
                "Por favor, proporciona tu correo electrónico institucional o personal registrado en la UPT."
            ),
            'procedures': (
                "Para consultar el estado de tus trámites, necesito validar tu identidad. "
                "Por favor, proporciona tu correo electrónico institucional o personal registrado en la UPT."
            ),
        }
        
        return prompts.get(category, 
            "Para procesar tu solicitud, necesito validar tu identidad. "
            "Por favor, proporciona tu correo electrónico registrado en la UPT."
        )
