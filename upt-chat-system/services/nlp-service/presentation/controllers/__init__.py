"""
Presentation Controllers
"""
from .nlp_controller import router as nlp_router
from .admin_controller import router as admin_router

__all__ = [
    'nlp_router',
    'admin_router',
]
