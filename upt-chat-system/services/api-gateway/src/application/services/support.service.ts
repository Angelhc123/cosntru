import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TicketDocument } from '../../infrastructure/database/schemas/ticket.schema';
import { TicketMessageDocument } from '../../infrastructure/database/schemas/ticket-message.schema';

@Injectable()
export class SupportService {
    constructor(
        @InjectModel('Ticket') private readonly ticketModel: Model<TicketDocument>,
        @InjectModel('TicketMessage') private readonly ticketMessageModel: Model<TicketMessageDocument>
    ) {}

    async createTicket(data: {
        sessionId: string;
        userId: string;
        userName: string;
        userEmail: string;
        subject: string;
        originalQuery: string;
        botResponse: string;
        confidence: number;
    }): Promise<TicketDocument> {
        try {
            // Generar ticketId único
            const date = new Date();
            const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
            const random = Math.floor(10000 + Math.random() * 90000);
            const ticketId = `TICKET-${dateStr}-${random}`;

            // Determinar prioridad basada en confidence
            let priority: 'low' | 'medium' | 'high' = 'medium';
            if (data.confidence < 0.4) {
                priority = 'high';
            } else if (data.confidence < 0.55) {
                priority = 'medium';
            } else {
                priority = 'low';
            }

            const ticket = await this.ticketModel.create({
                ticketId,
                ...data,
                priority,
                status: 'pending',
                createdAt: new Date(),
                updatedAt: new Date()
            });

            console.log('✅ Ticket creado:', ticketId);
            return ticket;
        } catch (error) {
            console.error('❌ Error creando ticket:', error);
            throw new HttpException('Error al crear ticket', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getTickets(status?: string): Promise<TicketDocument[]> {
        try {
            const filter = status ? { status } : {};
            return await this.ticketModel
                .find(filter)
                .sort({ createdAt: -1 })
                .exec();
        } catch (error) {
            console.error('❌ Error obteniendo tickets:', error);
            throw new HttpException('Error al obtener tickets', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getTicketById(ticketId: string): Promise<TicketDocument> {
        try {
            const ticket = await this.ticketModel.findOne({ ticketId }).exec();
            if (!ticket) {
                throw new HttpException('Ticket no encontrado', HttpStatus.NOT_FOUND);
            }
            return ticket;
        } catch (error) {
            throw error;
        }
    }

    async updateTicketStatus(ticketId: string, status: 'pending' | 'in-progress' | 'resolved', assignedTo?: string): Promise<TicketDocument> {
        try {
            const updateData: any = { 
                status, 
                updatedAt: new Date() 
            };
            
            if (assignedTo) {
                updateData.assignedTo = assignedTo;
            }
            
            if (status === 'resolved') {
                updateData.resolvedAt = new Date();
            }

            const ticket = await this.ticketModel.findOneAndUpdate(
                { ticketId },
                updateData,
                { new: true }
            ).exec();

            if (!ticket) {
                throw new HttpException('Ticket no encontrado', HttpStatus.NOT_FOUND);
            }

            return ticket;
        } catch (error) {
            throw error;
        }
    }

    async addMessage(ticketId: string, sender: 'admin' | 'user', senderName: string, message: string): Promise<TicketMessageDocument> {
        try {
            const ticketMessage = await this.ticketMessageModel.create({
                ticketId,
                sender,
                senderName,
                message,
                timestamp: new Date(),
                read: false
            });

            // Si es el primer mensaje del admin, cambiar estado a in-progress
            if (sender === 'admin') {
                const ticket = await this.ticketModel.findOne({ ticketId }).exec();
                if (ticket && ticket.status === 'pending') {
                    await this.updateTicketStatus(ticketId, 'in-progress');
                }
            }

            return ticketMessage;
        } catch (error) {
            console.error('❌ Error agregando mensaje al ticket:', error);
            throw new HttpException('Error al agregar mensaje', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getMessages(ticketId: string): Promise<TicketMessageDocument[]> {
        try {
            return await this.ticketMessageModel
                .find({ ticketId })
                .sort({ timestamp: 1 })
                .exec();
        } catch (error) {
            console.error('❌ Error obteniendo mensajes del ticket:', error);
            throw new HttpException('Error al obtener mensajes', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async markMessagesAsRead(ticketId: string, sender: 'admin' | 'user'): Promise<void> {
        try {
            const oppositeSender = sender === 'admin' ? 'user' : 'admin';
            await this.ticketMessageModel.updateMany(
                { ticketId, sender: oppositeSender, read: false },
                { read: true }
            ).exec();
        } catch (error) {
            console.error('❌ Error marcando mensajes como leídos:', error);
        }
    }
}
