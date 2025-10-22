import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete,
  Param, 
  Body,
  HttpStatus, 
  HttpException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FaqDocument } from '../../infrastructure/database/schemas/faq.schema';
import { CreateFaqDto, UpdateFaqDto, FaqResponseDto } from '../../application/dtos/faq.dto';

/**
 * Controller: FAQs Management
 * Gestión de preguntas frecuentes para el chatbot
 */
@ApiTags('FAQs')
@Controller('faqs')
export class FaqsController {
  constructor(
    @InjectModel('Faq') private readonly faqModel: Model<FaqDocument>
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las FAQs' })
  @ApiResponse({ status: 200, description: 'Lista de FAQs obtenida exitosamente' })
  async getAllFaqs(): Promise<{
    status: string;
    message: string;
    data: any[];
  }> {
    try {
      const faqs = await this.faqModel
        .find()
        .sort({ orden: 1, createdAt: 1 })
        .lean();

      return {
        status: 'success',
        message: 'FAQs obtenidas exitosamente',
        data: faqs.map(faq => ({
          id: faq._id.toString(),
          nombre: faq.nombre,
          texto_chat: faq.texto_chat,
          activo: faq.activo,
          orden: faq.orden,
          createdAt: faq.createdAt,
          updatedAt: faq.updatedAt
        }))
      };
    } catch (error) {
      console.error('❌ Error obteniendo FAQs:', error);
      throw new HttpException(
        'Error al obtener FAQs',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('active')
  @ApiOperation({ summary: 'Obtener solo FAQs activas' })
  @ApiResponse({ status: 200, description: 'FAQs activas obtenidas exitosamente' })
  async getActiveFaqs(): Promise<{
    status: string;
    message: string;
    data: any[];
  }> {
    try {
      const faqs = await this.faqModel
        .find({ activo: true })
        .sort({ orden: 1, createdAt: 1 })
        .lean();

      console.log(`📋 Encontradas ${faqs.length} FAQs activas`);

      return {
        status: 'success',
        message: 'FAQs activas obtenidas exitosamente',
        data: faqs.map(faq => ({
          id: faq._id.toString(),
          nombre: faq.nombre,
          texto_chat: faq.texto_chat,
          orden: faq.orden
        }))
      };
    } catch (error) {
      console.error('❌ Error obteniendo FAQs activas:', error);
      throw new HttpException(
        'Error al obtener FAQs activas',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener FAQ por ID' })
  @ApiResponse({ status: 200, description: 'FAQ obtenida exitosamente' })
  @ApiResponse({ status: 404, description: 'FAQ no encontrada' })
  async getFaqById(@Param('id') id: string): Promise<{
    status: string;
    message: string;
    data: any;
  }> {
    try {
      const faq = await this.faqModel.findById(id).lean();

      if (!faq) {
        throw new HttpException('FAQ no encontrada', HttpStatus.NOT_FOUND);
      }

      return {
        status: 'success',
        message: 'FAQ obtenida exitosamente',
        data: {
          id: faq._id.toString(),
          nombre: faq.nombre,
          texto_chat: faq.texto_chat,
          activo: faq.activo,
          orden: faq.orden,
          createdAt: faq.createdAt,
          updatedAt: faq.updatedAt
        }
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('❌ Error obteniendo FAQ:', error);
      throw new HttpException(
        'Error al obtener FAQ',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post()
  @ApiOperation({ summary: 'Crear nueva FAQ' })
  @ApiResponse({ status: 201, description: 'FAQ creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o FAQ duplicada' })
  async createFaq(@Body() createFaqDto: CreateFaqDto): Promise<{
    status: string;
    message: string;
    data: any;
  }> {
    try {
      // Verificar si ya existe una FAQ con el mismo nombre
      const existingFaq = await this.faqModel.findOne({ 
        nombre: createFaqDto.nombre 
      });

      if (existingFaq) {
        throw new HttpException(
          'Ya existe una FAQ con ese nombre',
          HttpStatus.BAD_REQUEST
        );
      }

      const newFaq = await this.faqModel.create(createFaqDto);
      const faqObject: any = newFaq.toObject();

      console.log('✅ FAQ creada:', faqObject.nombre);

      return {
        status: 'success',
        message: 'FAQ creada exitosamente',
        data: {
          id: faqObject._id.toString(),
          nombre: faqObject.nombre,
          texto_chat: faqObject.texto_chat,
          activo: faqObject.activo,
          orden: faqObject.orden,
          createdAt: faqObject.createdAt,
          updatedAt: faqObject.updatedAt
        }
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('❌ Error creando FAQ:', error);
      throw new HttpException(
        'Error al crear FAQ',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar FAQ' })
  @ApiResponse({ status: 200, description: 'FAQ actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'FAQ no encontrada' })
  @ApiResponse({ status: 400, description: 'Nombre duplicado' })
  async updateFaq(
    @Param('id') id: string,
    @Body() updateFaqDto: UpdateFaqDto
  ): Promise<{
    status: string;
    message: string;
    data: any;
  }> {
    try {
      // Si se está actualizando el nombre, verificar que no esté duplicado
      if (updateFaqDto.nombre) {
        const existingFaq = await this.faqModel.findOne({ 
          nombre: updateFaqDto.nombre,
          _id: { $ne: id }
        });

        if (existingFaq) {
          throw new HttpException(
            'Ya existe otra FAQ con ese nombre',
            HttpStatus.BAD_REQUEST
          );
        }
      }

      const updatedFaq = await this.faqModel.findByIdAndUpdate(
        id,
        { ...updateFaqDto, updatedAt: new Date() },
        { new: true }
      ).lean();

      if (!updatedFaq) {
        throw new HttpException('FAQ no encontrada', HttpStatus.NOT_FOUND);
      }

      console.log('✅ FAQ actualizada:', updatedFaq.nombre);
      
      return {
        status: 'success',
        message: 'FAQ actualizada exitosamente',
        data: {
          id: updatedFaq._id.toString(),
          nombre: updatedFaq.nombre,
          texto_chat: updatedFaq.texto_chat,
          activo: updatedFaq.activo,
          orden: updatedFaq.orden,
          createdAt: updatedFaq.createdAt,
          updatedAt: updatedFaq.updatedAt
        }
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('❌ Error actualizando FAQ:', error);
      throw new HttpException(
        'Error al actualizar FAQ',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar FAQ' })
  @ApiResponse({ status: 200, description: 'FAQ eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'FAQ no encontrada' })
  async deleteFaq(@Param('id') id: string): Promise<{
    status: string;
    message: string;
  }> {
    try {
      const deletedFaq = await this.faqModel.findByIdAndDelete(id);

      if (!deletedFaq) {
        throw new HttpException('FAQ no encontrada', HttpStatus.NOT_FOUND);
      }

      const faqObject: any = deletedFaq.toObject();
      console.log('🗑️ FAQ eliminada:', faqObject.nombre);

      return {
        status: 'success',
        message: 'FAQ eliminada exitosamente'
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('❌ Error eliminando FAQ:', error);
      throw new HttpException(
        'Error al eliminar FAQ',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
