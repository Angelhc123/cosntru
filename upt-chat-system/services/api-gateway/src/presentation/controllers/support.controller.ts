import { Controller, Get, Post, Put, Body, Param, Query, HttpException, HttpStatus } from '@nestjs/common';
import { SupportService } from '../../application/services/support.service';

@Controller('support')
export class SupportController {
    constructor(private readonly supportService: SupportService) {}

    @Post('tickets')
    async createTicket(@Body() body: {
        sessionId: string;
        userId: string;
        userName: string;
        userEmail: string;
        originalQuery: string;
        botResponse: string;
        confidence: number;
    }) {
        try {
            const ticket = await this.supportService.createTicket(body);
            return {
                success: true,
                data: ticket,
                message: 'Ticket creado exitosamente'
            };
        } catch (error) {
            throw new HttpException(
                error.message || 'Error al crear ticket',
                error.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('tickets')
    async getTickets(@Query('status') status?: string) {
        try {
            const tickets = await this.supportService.getTickets(status);
            return {
                success: true,
                data: tickets,
                count: tickets.length
            };
        } catch (error) {
            throw new HttpException(
                error.message || 'Error al obtener tickets',
                error.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('tickets/:ticketId')
    async getTicket(@Param('ticketId') ticketId: string) {
        try {
            const ticket = await this.supportService.getTicketById(ticketId);
            return {
                success: true,
                data: ticket
            };
        } catch (error) {
            throw error;
        }
    }

    @Put('tickets/:ticketId/status')
    async updateStatus(
        @Param('ticketId') ticketId: string,
        @Body() body: { status: 'pending' | 'in-progress' | 'resolved'; assignedTo?: string }
    ) {
        try {
            const ticket = await this.supportService.updateTicketStatus(ticketId, body.status, body.assignedTo);
            return {
                success: true,
                data: ticket,
                message: 'Estado del ticket actualizado'
            };
        } catch (error) {
            throw error;
        }
    }

    @Post('tickets/:ticketId/messages')
    async addMessage(
        @Param('ticketId') ticketId: string,
        @Body() body: { sender: 'admin' | 'user'; senderName: string; message: string }
    ) {
        try {
            const message = await this.supportService.addMessage(
                ticketId,
                body.sender,
                body.senderName,
                body.message
            );
            return {
                success: true,
                data: message,
                message: 'Mensaje agregado'
            };
        } catch (error) {
            throw error;
        }
    }

    @Get('tickets/:ticketId/messages')
    async getMessages(@Param('ticketId') ticketId: string) {
        try {
            const messages = await this.supportService.getMessages(ticketId);
            return {
                success: true,
                data: messages,
                count: messages.length
            };
        } catch (error) {
            throw error;
        }
    }

    @Put('tickets/:ticketId/messages/read')
    async markAsRead(
        @Param('ticketId') ticketId: string,
        @Body() body: { sender: 'admin' | 'user' }
    ) {
        try {
            await this.supportService.markMessagesAsRead(ticketId, body.sender);
            return {
                success: true,
                message: 'Mensajes marcados como leídos'
            };
        } catch (error) {
            throw error;
        }
    }
}
