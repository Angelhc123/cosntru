import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class NlpService {
    private readonly nlpServiceUrl: string;

    constructor() {
        this.nlpServiceUrl = process.env.NLP_SERVICE_URL || 'http://127.0.0.1:8001';
        console.log('🔧 NLP Service URL configurada:', this.nlpServiceUrl);
    }

    async processMessage(text: string, language: string = 'es', sessionId?: string): Promise<any> {
        try {
            console.log(`📤 Enviando a NLP Service: ${this.nlpServiceUrl}/api/v1/nlp/process`);

            const response = await axios.post(
                'http://127.0.0.1:8001/api/v1/nlp/process',
                {
                    message: text,
                    session_id: sessionId || 'default_session',
                    user_id: 'anonymous_user'
                },
                {
                    timeout: 10000, // 10 segundos
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('✅ Respuesta de NLP Service:', response.data);

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
