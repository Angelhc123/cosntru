import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { TicketSchema } from '../../infrastructure/database/schemas/ticket.schema';
import { TicketsController } from '../controllers/tickets.controller';
import { TicketsService } from '../../application/services/tickets.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Ticket', schema: TicketSchema },
    ]),
    HttpModule,
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}
