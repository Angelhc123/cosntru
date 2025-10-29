import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TicketDocument } from '../../infrastructure/database/schemas/ticket.schema';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TicketsService {
  private readonly logger = new Logger(TicketsService.name);
  private readonly notificationServiceUrl = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3005';

  constructor(
    @InjectModel('Ticket') private ticketModel: Model<TicketDocument>,
    private readonly httpService: HttpService,
  ) {}

  /**
   * Generar ID único para ticket: TKT-YYYYMMDD-XXXX
   */
  private async generateTicketId(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;

    // Contar tickets del día
    const count = await this.ticketModel.countDocuments({
      ticketId: new RegExp(`^TKT-${dateStr}`),
    });

    const sequence = String(count + 1).padStart(4, '0');
    return `TKT-${dateStr}-${sequence}`;
  }

  /**
   * Crear nuevo ticket
   */
  async createTicket(data: {
    sessionId: string;
    userId: string;
    userName: string;
    userEmail: string;
    subject: string;
    originalQuery: string;
    escalationReason: string;
    initialMessage?: string;
  }): Promise<TicketDocument> {
    const ticketId = await this.generateTicketId();

    const messages: any[] = [];
    
    // Agregar mensaje inicial del usuario si existe
    if (data.initialMessage) {
      messages.push({
        sender: 'user',
        senderName: data.userName,
        text: data.initialMessage,
        timestamp: new Date(),
      });
    }

    const ticket = await this.ticketModel.create({
      ticketId,
      sessionId: data.sessionId,
      userId: data.userId,
      userName: data.userName,
      userEmail: data.userEmail,
      subject: data.subject,
      originalQuery: data.originalQuery,
      escalationReason: data.escalationReason,
      messages,
      status: 'pending',
      createdAt: new Date(),
    });

    return ticket;
  }

  /**
   * Obtener todos los tickets (para admin)
   */
  async getAllTickets(): Promise<TicketDocument[]> {
    return this.ticketModel
      .find()
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Obtener tickets de un usuario específico
   */
  async getUserTickets(userId: string): Promise<TicketDocument[]> {
    return this.ticketModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Obtener un ticket por ID
   */
  async getTicketById(ticketId: string): Promise<TicketDocument> {
    const ticket = await this.ticketModel.findOne({ ticketId }).exec();
    if (!ticket) {
      throw new NotFoundException(`Ticket ${ticketId} no encontrado`);
    }
    return ticket;
  }

  /**
   * Asignar ticket a un admin
   */
  async assignTicket(
    ticketId: string,
    adminId: string,
    adminName: string,
    adminEmail: string,
  ): Promise<TicketDocument> {
    // Verificar que el admin no tenga ya un ticket asignado
    const activeTicket = await this.ticketModel.findOne({
      adminId,
      status: 'assigned',
    }).exec();

    if (activeTicket) {
      throw new BadRequestException(
        `El admin ya tiene un ticket activo asignado: ${activeTicket.ticketId}`,
      );
    }

    const ticket = await this.getTicketById(ticketId);

    if (ticket.status !== 'pending') {
      throw new BadRequestException(
        `El ticket ${ticketId} ya está ${ticket.status}`,
      );
    }

    // Asignar ticket
    ticket.adminId = adminId;
    ticket.adminName = adminName;
    ticket.adminEmail = adminEmail;
    ticket.status = 'assigned';
    ticket.assignedAt = new Date();

    // Agregar mensaje del sistema
    ticket.messages.push({
      sender: 'system',
      senderName: 'Sistema',
      text: `Tu ticket ha sido asignado a ${adminName}. Pronto recibirás ayuda.`,
      timestamp: new Date(),
    });

    return ticket.save();
  }

  /**
   * Agregar mensaje a un ticket
   */
  async addMessage(
    ticketId: string,
    sender: 'user' | 'admin',
    senderName: string,
    text: string,
  ): Promise<TicketDocument> {
    const ticket = await this.getTicketById(ticketId);

    if (ticket.status === 'resolved') {
      throw new BadRequestException('No se pueden enviar mensajes a un ticket resuelto');
    }

    ticket.messages.push({
      sender,
      senderName,
      text,
      timestamp: new Date(),
    });

    return ticket.save();
  }

  /**
   * Finalizar ticket
   */
  async resolveTicket(ticketId: string): Promise<TicketDocument> {
    const ticket = await this.getTicketById(ticketId);

    if (ticket.status === 'resolved') {
      throw new BadRequestException(`El ticket ${ticketId} ya está resuelto`);
    }

    ticket.status = 'resolved';
    ticket.resolvedAt = new Date();

    // Agregar mensaje del sistema
    ticket.messages.push({
      sender: 'system',
      senderName: 'Sistema',
      text: 'Este ticket ha sido marcado como resuelto.',
      timestamp: new Date(),
    });

    const savedTicket = await ticket.save();

    // 📧 ENVIAR EMAIL CON TRANSCRIPCIÓN DEL TICKET
    try {
      await this.sendTicketTranscriptionEmail(savedTicket);
      this.logger.log(`✅ Emails de transcripción enviados para ticket ${ticketId}`);
    } catch (error) {
      this.logger.error(`❌ Error enviando emails de transcripción para ticket ${ticketId}:`, error);
      // No lanzar error - el ticket ya está resuelto, el email es secundario
    }

    return savedTicket;
  }

  /**
   * Enviar email con transcripción del ticket a usuario y admin
   */
  private async sendTicketTranscriptionEmail(ticket: TicketDocument): Promise<void> {
    // Generar HTML de la transcripción
    const transcription = this.generateTicketTranscriptionHTML(ticket);

    // Preparar emails
    const emailsToSend = [
      {
        to: ticket.userEmail,
        subject: `Ticket #${ticket.ticketId} Resuelto - Transcripción de la Conversación`,
        html: transcription,
      },
    ];

    // Si hay admin asignado, también enviarle
    if (ticket.adminEmail) {
      emailsToSend.push({
        to: ticket.adminEmail,
        subject: `Ticket #${ticket.ticketId} Resuelto - Transcripción (Copia Admin)`,
        html: transcription,
      });
    }

    // Enviar emails usando notification-service
    for (const email of emailsToSend) {
      try {
        await firstValueFrom(
          this.httpService.post(`${this.notificationServiceUrl}/api/notifications/email/send`, {
            to: email.to,
            subject: email.subject,
            htmlContent: email.html,
          }),
        );
        this.logger.log(`📧 Email enviado a: ${email.to}`);
      } catch (error) {
        this.logger.error(`❌ Error enviando email a ${email.to}:`, error.message);
      }
    }
  }

  /**
   * Generar HTML de la transcripción del ticket
   */
  private generateTicketTranscriptionHTML(ticket: TicketDocument): string {
    const formatDate = (date: Date) => {
      return new Date(date).toLocaleString('es-PE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    const messagesHTML = ticket.messages
      .map((msg) => {
        const senderLabel = msg.sender === 'user' ? '👤 Usuario' : msg.sender === 'admin' ? '👨‍💼 Administrador' : 'ℹ️ Sistema';
        const bgColor = msg.sender === 'user' ? '#e3f2fd' : msg.sender === 'admin' ? '#f3e5f5' : '#f5f5f5';
        
        return `
          <div style="background: ${bgColor}; padding: 12px; margin-bottom: 10px; border-radius: 8px; border-left: 4px solid ${msg.sender === 'user' ? '#2196F3' : msg.sender === 'admin' ? '#9C27B0' : '#9E9E9E'};">
            <div style="font-weight: 600; color: #333; margin-bottom: 5px;">
              ${senderLabel}: ${msg.senderName}
            </div>
            <div style="color: #555; line-height: 1.6;">
              ${msg.text}
            </div>
            <div style="font-size: 11px; color: #999; margin-top: 5px;">
              ${formatDate(msg.timestamp)}
            </div>
          </div>
        `;
      })
      .join('');

    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Transcripción Ticket ${ticket.ticketId}</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; padding: 20px;">
        <div style="max-width: 800px; margin: 0 auto; background: white; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🎫 Ticket Resuelto</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">#${ticket.ticketId}</p>
          </div>

          <!-- Info del Ticket -->
          <div style="padding: 30px;">
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h2 style="margin: 0 0 15px 0; color: #333; font-size: 20px;">📋 Información del Ticket</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: 600;">Usuario:</td>
                  <td style="padding: 8px 0; color: #333;">${ticket.userName} (${ticket.userEmail})</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: 600;">Administrador:</td>
                  <td style="padding: 8px 0; color: #333;">${ticket.adminName || 'No asignado'} ${ticket.adminEmail ? `(${ticket.adminEmail})` : ''}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: 600;">Asunto:</td>
                  <td style="padding: 8px 0; color: #333;">${ticket.subject || 'Sin asunto'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: 600;">Creado:</td>
                  <td style="padding: 8px 0; color: #333;">${formatDate(ticket.createdAt)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: 600;">Resuelto:</td>
                  <td style="padding: 8px 0; color: #333;">${ticket.resolvedAt ? formatDate(ticket.resolvedAt) : 'N/A'}</td>
                </tr>
                ${ticket.originalQuery ? `
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: 600;">Consulta Original:</td>
                  <td style="padding: 8px 0; color: #333;">${ticket.originalQuery}</td>
                </tr>
                ` : ''}
              </table>
            </div>

            <!-- Transcripción de Mensajes -->
            <h2 style="margin: 0 0 20px 0; color: #333; font-size: 20px;">💬 Transcripción de la Conversación</h2>
            <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 15px; background: #fafafa;">
              ${messagesHTML}
            </div>

            <!-- Footer -->
            <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e0e0e0; text-align: center; color: #666;">
              <p style="margin: 5px 0; font-size: 14px;">Este es un email automático del Sistema de Soporte UPT</p>
              <p style="margin: 5px 0; font-size: 14px;">Por favor, no responder a este correo</p>
              <p style="margin: 15px 0 0 0; font-size: 13px; color: #999;">
                © ${new Date().getFullYear()} Universidad Privada de Tacna - Todos los derechos reservados
              </p>
            </div>
          </div>

        </div>
      </body>
      </html>
    `;
  }

  /**
   * Obtener tickets asignados a un admin
   */
  async getAdminTickets(adminId: string): Promise<TicketDocument[]> {
    return this.ticketModel
      .find({ adminId })
      .sort({ createdAt: -1 })
      .exec();
  }
}
