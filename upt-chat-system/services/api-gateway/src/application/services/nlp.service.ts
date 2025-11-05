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
                        userId: userId || 'anonymous',  // ✅ Campo principal, no metadata
                        sender: 'user',
                        text: text,
                        timestamp: new Date(),
                        metadata: {
                            language: language
                        }
                    });
                    console.log('✅ Mensaje de usuario guardado en MongoDB con userId:', userId);
                } catch (dbError) {
                    console.error('⚠️  Error guardando mensaje de usuario:', dbError.message);
                }
            }

            // 2. Enviar mensaje al servicio NLP
            const response = await axios.post(
                `${this.nlpServiceUrl}/api/v1/nlp/process`,
                {
                    session_id: sessionId || 'default_session',
                    user_id: userId || 'anonymous_user',
                    message: text
                },
                {
                    timeout: 10000, // 10 segundos
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('✅ Respuesta de NLP Service:', response.data);

            // 3. Detectar si requiere escalamiento a soporte humano
            // REGLA: Solo escalar si confidence < 0.5 (muy bajo) o 2+ mensajes consecutivos < 0.7
            const confidence = response.data?.confidence || response.data?.data?.confidence || 1.0;
            
            // Contar mensajes con baja confianza en esta sesión
            let lowConfidenceCount = 0;
            if (sessionId) {
                lowConfidenceCount = await this.messageModel.countDocuments({
                    sessionId: sessionId,
                    sender: 'bot',
                    'metadata.confidence': { $lt: 0.7 }
                });
            }
            
            // Escalar solo si:
            // - Confidence < 0.5 (muy bajo, escalar inmediatamente)
            // - O 2+ respuestas consecutivas con confidence < 0.7
            const requiresEscalation = confidence < 0.5 || (confidence < 0.7 && lowConfidenceCount >= 1);
            
            if (requiresEscalation) {
                console.log('⚠️ ESCALAMIENTO DETECTADO - Confidence:', confidence, 'Count:', lowConfidenceCount);
            }

            // 4. Guardar respuesta del BOT en MongoDB y obtener messageId
            // Si requiere escalación, guardar mensaje especial con opciones
            const botResponse = response.data?.response || response.data?.data?.response;
            let botMessageId = null;
            let finalResponse = botResponse;
            
            // Si requiere escalación, modificar la respuesta para incluir prompt
            if (requiresEscalation) {
                finalResponse = botResponse; // Mantener respuesta original
            }
            
            if (sessionId && finalResponse) {
                try {
                    const savedMessage = await this.messageModel.create({
                        sessionId: sessionId,
                        userId: userId || 'anonymous',
                        sender: 'bot',
                        text: finalResponse,
                        timestamp: new Date(),
                        metadata: {
                            intent: response.data?.intent || response.data?.data?.intent,
                            confidence: confidence,
                            source: response.data?.source || response.data?.data?.source,
                            requires_escalation: requiresEscalation,
                            escalation_prompt: requiresEscalation
                        }
                    });
                    botMessageId = (savedMessage._id as any).toString();
                    console.log('✅ Respuesta del bot guardada en MongoDB con ID:', botMessageId);
                } catch (dbError) {
                    console.error('⚠️  Error guardando respuesta del bot:', dbError.message);
                }
            } else {
                console.warn('⚠️  No se pudo guardar respuesta del bot. sessionId:', sessionId, 'botResponse:', botResponse);
            }

            // 5. Agregar campo de escalamiento, messageId Y prompt de escalación a la respuesta
            return {
                ...response.data,
                response: finalResponse,
                messageId: botMessageId,
                requires_escalation: requiresEscalation,
                show_escalation_prompt: requiresEscalation, // Nuevo campo para frontend
                escalation_reason: requiresEscalation ? `Confianza baja (${(confidence * 100).toFixed(1)}%)` : null
            };

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
                    message: text
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
