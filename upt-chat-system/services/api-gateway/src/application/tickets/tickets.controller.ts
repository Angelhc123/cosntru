import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { TicketsService } from './tickets.service';

@Controller('api/v1/tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  /**
   * POST /api/v1/tickets - Crear nuevo ticket
   */
  @Post()
  async createTicket(@Body() body: {
    sessionId: string;
    userId: string;
    userName: string;
    userEmail: string;
    subject: string;
    originalQuery: string;
    escalationReason: string;
    initialMessage?: string;
  }) {
    const ticket = await this.ticketsService.createTicket(body);
    return {
      status: 'success',
      message: 'Ticket creado exitosamente',
      data: ticket,
    };
  }

  /**
   * GET /api/v1/tickets - Obtener todos los tickets (admin)
   */
  @Get()
  async getAllTickets() {
    const tickets = await this.ticketsService.getAllTickets();
    return {
      status: 'success',
      data: tickets,
    };
  }

  /**
   * GET /api/v1/tickets/user/:userId - Obtener tickets de un usuario
   */
  @Get('user/:userId')
  async getUserTickets(@Param('userId') userId: string) {
    const tickets = await this.ticketsService.getUserTickets(userId);
    return {
      status: 'success',
      data: tickets,
    };
  }

  /**
   * GET /api/v1/tickets/:ticketId - Obtener un ticket específico
   */
  @Get(':ticketId')
  async getTicket(@Param('ticketId') ticketId: string) {
    const ticket = await this.ticketsService.getTicketById(ticketId);
    return {
      status: 'success',
      data: ticket,
    };
  }

  /**
   * PUT /api/v1/tickets/:ticketId/assign - Asignar ticket a admin
   */
  @Put(':ticketId/assign')
  async assignTicket(
    @Param('ticketId') ticketId: string,
    @Body() body: {
      adminId: string;
      adminName: string;
      adminEmail: string;
    },
  ) {
    const ticket = await this.ticketsService.assignTicket(
      ticketId,
      body.adminId,
      body.adminName,
      body.adminEmail,
    );
    return {
      status: 'success',
      message: 'Ticket asignado exitosamente',
      data: ticket,
    };
  }

  /**
   * POST /api/v1/tickets/:ticketId/messages - Enviar mensaje
   */
  @Post(':ticketId/messages')
  async addMessage(
    @Param('ticketId') ticketId: string,
    @Body() body: {
      sender: 'user' | 'admin';
      senderName: string;
      text: string;
    },
  ) {
    const ticket = await this.ticketsService.addMessage(
      ticketId,
      body.sender,
      body.senderName,
      body.text,
    );
    return {
      status: 'success',
      message: 'Mensaje enviado',
      data: ticket,
    };
  }

  /**
   * PUT /api/v1/tickets/:ticketId/resolve - Finalizar ticket
   */
  @Put(':ticketId/resolve')
  async resolveTicket(@Param('ticketId') ticketId: string) {
    const ticket = await this.ticketsService.resolveTicket(ticketId);
    return {
      status: 'success',
      message: 'Ticket resuelto exitosamente',
      data: ticket,
    };
  }

  /**
   * GET /api/v1/tickets/admin/:adminId - Obtener tickets de un admin
   */
  @Get('admin/:adminId')
  async getAdminTickets(@Param('adminId') adminId: string) {
    const tickets = await this.ticketsService.getAdminTickets(adminId);
    return {
      status: 'success',
      data: tickets,
    };
  }
}
