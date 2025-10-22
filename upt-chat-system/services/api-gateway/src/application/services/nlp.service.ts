import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { MessageDocument } from '../../infrastructure/database/schemas/message.schema';

@Injectable()
export class NlpService {
    private readonly nlpServiceUrl: string;

    constructor(
        @InjectModel('Message') private readonly messageModel: Model<MessageDocument>
    ) {
        this.nlpServiceUrl = process.env.NLP_SERVICE_URL || 'http://127.0.0.1:8001';
        console.log('🔧 NLP Service URL configurada:', this.nlpServiceUrl);
    }

    async processMessage(text: string, language: string = 'es', sessionId?: string, userId?: string): Promise<any> {
        try {
            console.log(`📤 Enviando a NLP Service: ${this.nlpServiceUrl}/api/v1/nlp/process`);

            // 1. Guardar mensaje del USUARIO en MongoDB
            if (sessionId) {
                try {
                    await this.messageModel.create({
                        sessionId: sessionId,
                        sender: 'user',
                        text: text,
                        timestamp: new Date(),
                        metadata: {
                            userId: userId || 'anonymous',
                            language: language
                        }
                    });
                    console.log('✅ Mensaje de usuario guardado en MongoDB');
                } catch (dbError) {
                    console.error('⚠️  Error guardando mensaje de usuario:', dbError.message);
                }
            }

            // 2. Enviar mensaje al servicio NLP
            const response = await axios.post(
                'http://127.0.0.1:8001/api/v1/nlp/process',
                {
                    message: text,
                    session_id: sessionId || 'default_session',
                    user_id: userId || 'anonymous_user'
                },
                {
                    timeout: 10000, // 10 segundos
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('✅ Respuesta de NLP Service:', response.data);

            // 3. Guardar respuesta del BOT en MongoDB
            if (sessionId && response.data && response.data.data && response.data.data.response) {
                try {
                    await this.messageModel.create({
                        sessionId: sessionId,
                        sender: 'bot',
                        text: response.data.data.response,
                        timestamp: new Date(),
                        metadata: {
                            intent: response.data.data.intent,
                            confidence: response.data.data.confidence,
                            source: response.data.data.source
                        }
                    });
                    console.log('✅ Respuesta del bot guardada en MongoDB');
                } catch (dbError) {
                    console.error('⚠️  Error guardando respuesta del bot:', dbError.message);
                }
            }

            return response.data;

        } catch (error) {
            console.error('❌ Error llamando a NLP Service:', {
                message: error.message,
                code: error.code,
                url: `${this.nlpServiceUrl}/api/v1/nlp/process`,
                response: error.response?.data,
                status: error.response?.status
            });

            if (error.code === 'ECONNREFUSED') {
                throw new HttpException(
                    'NLP Service no disponible. Por favor, verifica que esté corriendo en el puerto 8001.',
                    HttpStatus.SERVICE_UNAVAILABLE
                );
            }

            throw new HttpException(
                error.response?.data?.message || 'Error al procesar mensaje con NLP Service',
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async detectIntent(text: string, language: string = 'es'): Promise<any> {
        try {
            const response = await axios.post(
                `${this.nlpServiceUrl}/api/v1/nlp/detect-intent`,
                {
                    message: text,
                    language: language
                },
                {
                    timeout: 5000,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data;

        } catch (error) {
            console.error('❌ Error detectando intent:', error.message);
            throw new HttpException(
                'Error al detectar intención',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async searchFaq(query: string): Promise<any> {
        try {
            const response = await axios.post(
                `${this.nlpServiceUrl}/search-faq`,
                {
                    query: query
                },
                {
                    timeout: 5000
                }
            );

            return response.data;

        } catch (error) {
            console.error('❌ Error buscando FAQ:', error.message);
            throw new HttpException(
                'Error al buscar en FAQ',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
