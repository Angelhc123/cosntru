"""
Search Knowledge Base Use Case - Application Layer
Caso de uso para buscar directamente en la knowledge base.
"""
from domain.services.nlp_domain_service import NLPDomainService
from domain.value_objects.message import Message
from application.dtos.process_request_dto import SearchKnowledgeBaseRequestDTO
from application.dtos.nlp_response_dto import (
    SearchKnowledgeBaseResponseDTO,
    SearchResultDTO,
    FAQDTO
)


class SearchKnowledgeBaseUseCase:
    """
    Use Case para buscar en la knowledge base
    
    Búsqueda directa sin necesidad de intent detection.
    Útil para:
    - Exploración de la KB
    - Testing
    - Features de "búsqueda avanzada" en UI
    """
    
    def __init__(self, nlp_service: NLPDomainService):
        self.nlp_service = nlp_service
    
    async def execute(self, request: SearchKnowledgeBaseRequestDTO) -> SearchKnowledgeBaseResponseDTO:
        """
        Busca en la knowledge base
        """
        # Crear Message VO para la query
        message = Message.create(request.query)
        
        # Buscar en KB
        results = await self.nlp_service.search_knowledge_base(
            message,
            top_n=request.top_n
        )
        
        # Convertir a DTOs
        search_results = []
        for faq, confidence in results:
            faq_dto = FAQDTO(
                id=faq.id,
                question=faq.question,
                answer=faq.answer,
                relevance=confidence.value
            )
            search_results.append(
                SearchResultDTO(faq=faq_dto, confidence=confidence.value)
            )
        
        return SearchKnowledgeBaseResponseDTO(
            results=search_results,
            total_found=len(search_results),
            query=request.query
        )
