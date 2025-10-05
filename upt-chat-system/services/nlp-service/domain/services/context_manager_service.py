"""
Context Manager Service - Domain Layer
Maneja el contexto de conversación.
"""
from typing import Dict, Optional, Any
from domain.entities.conversation import Conversation


class ContextManagerService:
    """
    Servicio de dominio para gestión de contexto conversacional
    
    Mantiene y gestiona el estado de conversaciones activas.
    """
    
    def __init__(self):
        # En memoria (para demo) - en producción sería Redis/MongoDB
        self._conversations: Dict[str, Conversation] = {}
    
    def get_or_create_conversation(self, session_id: str, user_id: str) -> Conversation:
        """
        Obtiene una conversación existente o crea una nueva
        """
        if session_id in self._conversations:
            return self._conversations[session_id]
        
        conversation = Conversation(
            session_id=session_id,
            user_id=user_id
        )
        self._conversations[session_id] = conversation
        return conversation
    
    def get_conversation(self, session_id: str) -> Optional[Conversation]:
        """
        Obtiene una conversación por session_id
        """
        return self._conversations.get(session_id)
    
    def save_conversation(self, conversation: Conversation) -> None:
        """
        Guarda/actualiza una conversación
        """
        self._conversations[conversation.session_id] = conversation
    
    def delete_conversation(self, session_id: str) -> bool:
        """
        Elimina una conversación
        """
        if session_id in self._conversations:
            del self._conversations[session_id]
            return True
        return False
    
    def get_context_value(self, session_id: str, key: str) -> Optional[Any]:
        """
        Obtiene un valor del contexto de una conversación
        """
        conversation = self.get_conversation(session_id)
        if conversation:
            return conversation.get_context_value(key)
        return None
    
    def set_context_value(self, session_id: str, key: str, value: Any) -> bool:
        """
        Establece un valor en el contexto de una conversación
        """
        conversation = self.get_conversation(session_id)
        if conversation:
            conversation.set_context_value(key, value)
            return True
        return False
    
    def clear_context(self, session_id: str) -> bool:
        """
        Limpia el contexto de una conversación
        """
        conversation = self.get_conversation(session_id)
        if conversation:
            conversation.clear_context()
            return True
        return False
    
    def get_last_intent(self, session_id: str) -> Optional[str]:
        """
        Obtiene el último intent detectado en una conversación
        """
        conversation = self.get_conversation(session_id)
        if conversation:
            return conversation.last_intent
        return None
    
    def has_active_context(self, session_id: str) -> bool:
        """
        Verifica si una conversación tiene contexto activo
        """
        conversation = self.get_conversation(session_id)
        if conversation:
            return len(conversation.context) > 0 or conversation.last_intent is not None
        return False
    
    def get_conversation_count(self) -> int:
        """
        Retorna el número de conversaciones activas
        """
        return len(self._conversations)
    
    def cleanup_old_conversations(self, max_age_hours: int = 24) -> int:
        """
        Limpia conversaciones antiguas
        Retorna número de conversaciones eliminadas
        """
        from datetime import datetime, timedelta
        
        cutoff_time = datetime.now() - timedelta(hours=max_age_hours)
        sessions_to_delete = []
        
        for session_id, conversation in self._conversations.items():
            if conversation.updated_at < cutoff_time:
                sessions_to_delete.append(session_id)
        
        for session_id in sessions_to_delete:
            del self._conversations[session_id]
        
        return len(sessions_to_delete)
