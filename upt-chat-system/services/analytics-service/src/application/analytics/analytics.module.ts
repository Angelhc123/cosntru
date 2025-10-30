import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsController } from '../../presentation/controllers/analytics.controller';
import { AnalyticsService } from './analytics.service';
import { ReportExportService } from './report-export.service';
import { MessageDocument, MessageSchema } from '../../infrastructure/database/schemas/message.schema';
import { ChatSession, ChatSessionSchema } from '../../infrastructure/database/schemas/chat-session.schema';
import { Faq, FaqSchema } from '../../infrastructure/database/schemas/faq.schema';
import { Ticket, TicketSchema } from '../../infrastructure/database/schemas/ticket.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MessageDocument.name, schema: MessageSchema },
      { name: ChatSession.name, schema: ChatSessionSchema },
      { name: Faq.name, schema: FaqSchema },
      { name: Ticket.name, schema: TicketSchema },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, ReportExportService],
  exports: [AnalyticsService, ReportExportService],
})
export class AnalyticsModule {}
