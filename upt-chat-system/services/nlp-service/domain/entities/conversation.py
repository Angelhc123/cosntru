"""
Conversation Entity - Domain Layer
Representa una conversación con su contexto e historial.
"""
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class MessageType(Enum):
    """Tipos de mensaje en una conversación"""
    USER = "user"
    BOT = "bot"
    SYSTEM = "system"


@dataclass
class ConversationMessage:
    """Mensaje individual en una conversación"""
    type: MessageType
    content: str
    timestamp: datetime
    intent_detected: Optional[str] = None
    confidence: Optional[float] = None
    metadata: Optional[Dict[str, Any]] = None


@dataclass
class Conversation:
    """
    Entidad Conversation siguiendo DDD
    
    Mantiene el contexto de una conversación entre usuario y bot.
    """
    
    session_id: str
    user_id: str
    messages: List[ConversationMessage] = field(default_factory=list)
    context: Dict[str, Any] = field(default_factory=dict)
    last_intent: Optional[str] = None
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)
    
    def __post_init__(self):
        """Validaciones de negocio"""
        if not self.session_id or not self.session_id.strip():
            raise ValueError("Conversation session_id cannot be empty")
        
        if not self.user_id or not self.user_id.strip():
            raise ValueError("Conversation user_id cannot be empty")
    
    def add_user_message(self, content: str, intent: Optional[str] = None, 
                         confidence: Optional[float] = None) -> None:
        """
        Agrega un mensaje del usuario a la conversación
        """
        message = ConversationMessage(
            type=MessageType.USER,
            content=content,
            timestamp=datetime.now(),
            intent_detected=intent,
            confidence=confidence
        )
        self.messages.append(message)
        
        if intent:
            self.last_intent = intent
        
        self.updated_at = datetime.now()
    
    def add_bot_message(self, content: str, intent: Optional[str] = None,
                        metadata: Optional[Dict[str, Any]] = None) -> None:
        """
        Agrega un mensaje del bot a la conversación
        """
        message = ConversationMessage(
            type=MessageType.BOT,
            content=content,
            timestamp=datetime.now(),
            intent_detected=intent,
            metadata=metadata
        )
        self.messages.append(message)
        self.updated_at = datetime.now()
    
    def add_system_message(self, content: str) -> None:
        """
        Agrega un mensaje del sistema
        """
        message = ConversationMessage(
            type=MessageType.SYSTEM,
            content=content,
            timestamp=datetime.now()
        )
        self.messages.append(message)
        self.updated_at = datetime.now()
    
    def get_last_user_message(self) -> Optional[ConversationMessage]:
        """
        Obtiene el último mensaje del usuario
        """
        user_messages = [m for m in self.messages if m.type == MessageType.USER]
        return user_messages[-1] if user_messages else None
    
    def get_last_bot_message(self) -> Optional[ConversationMessage]:
        """
        Obtiene el último mensaje del bot
        """
        bot_messages = [m for m in self.messages if m.type == MessageType.BOT]
        return bot_messages[-1] if bot_messages else None
    
    def get_context_value(self, key: str) -> Optional[Any]:
        """
        Obtiene un valor del contexto
        """
        return self.context.get(key)
    
    def set_context_value(self, key: str, value: Any) -> None:
        """
        Establece un valor en el contexto
        """
        self.context[key] = value
        self.updated_at = datetime.now()
    
    def clear_context(self) -> None:
        """
        Limpia el contexto de la conversación
        """
        self.context = {}
        self.last_intent = None
        self.updated_at = datetime.now()
    
    def get_message_count(self) -> int:
        """
        Retorna el número total de mensajes
        """
        return len(self.messages)
    
    def get_recent_messages(self, count: int = 5) -> List[ConversationMessage]:
        """
        Obtiene los últimos N mensajes
        """
        return self.messages[-count:] if len(self.messages) >= count else self.messages
    
    def __str__(self) -> str:
        return f"Conversation(session={self.session_id}, messages={len(self.messages)})"
    
    def __repr__(self) -> str:
        return self.__str__()
