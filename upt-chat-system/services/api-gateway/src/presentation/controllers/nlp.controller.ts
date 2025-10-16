import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { NlpService } from '../../application/services/nlp.service';

@Controller('nlp')
export class NlpController {
    constructor(private readonly nlpService: NlpService) {}

    @Post('process')
    async processMessage(@Body() body: { text: string; session_id?: string; language?: string }) {
        try {
            const { text, session_id, language = 'es' } = body;

            if (!text || text.trim().length === 0) {
                throw new HttpException('Text is required', HttpStatus.BAD_REQUEST);
            }

            console.log('🤖 Procesando mensaje con NLP:', { text, session_id });

            const result = await this.nlpService.processMessage(text, language, session_id);

            return {
                success: true,
                data: result,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error('❌ Error en NLP Controller:', error);
            throw new HttpException(
                error.message || 'Error processing message with NLP',
                error.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Post('detect-intent')
    async detectIntent(@Body() body: { text: string; language?: string }) {
        try {
            const { text, language = 'es' } = body;

            if (!text) {
                throw new HttpException('Text is required', HttpStatus.BAD_REQUEST);
            }

            const result = await this.nlpService.detectIntent(text, language);

            return {
                success: true,
                data: result
            };

        } catch (error) {
            console.error('❌ Error detectando intent:', error);
            throw new HttpException(
                error.message || 'Error detecting intent',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
