import { IsString, IsBoolean, IsNumber, IsOptional, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO: Crear FAQ
 */
export class CreateFaqDto {
  @ApiProperty({ 
    description: 'Nombre de la pregunta frecuente',
    example: 'Olvidé mi contraseña'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  nombre: string;

  @ApiProperty({ 
    description: 'Texto que se enviará al chat cuando se haga click',
    example: 'olvidé mi contraseña'
  })
  @IsString()
  @IsNotEmpty()
  texto_chat: string;

  @ApiProperty({ 
    description: 'Estado de la FAQ (activo/inactivo)',
    example: true,
    default: true
  })
  @IsBoolean()
  @IsOptional()
  activo?: boolean;

  @ApiProperty({ 
    description: 'Orden de visualización',
    example: 1,
    default: 0
  })
  @IsNumber()
  @IsOptional()
  orden?: number;
}

/**
 * DTO: Actualizar FAQ
 */
export class UpdateFaqDto {
  @ApiProperty({ 
    description: 'Nombre de la pregunta frecuente',
    example: 'Olvidé mi contraseña',
    required: false
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  nombre?: string;

  @ApiProperty({ 
    description: 'Texto que se enviará al chat',
    example: 'olvidé mi contraseña',
    required: false
  })
  @IsString()
  @IsOptional()
  texto_chat?: string;

  @ApiProperty({ 
    description: 'Estado de la FAQ',
    example: true,
    required: false
  })
  @IsBoolean()
  @IsOptional()
  activo?: boolean;

  @ApiProperty({ 
    description: 'Orden de visualización',
    example: 1,
    required: false
  })
  @IsNumber()
  @IsOptional()
  orden?: number;
}

/**
 * DTO: Respuesta FAQ
 */
export class FaqResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nombre: string;

  @ApiProperty()
  texto_chat: string;

  @ApiProperty()
  activo: boolean;

  @ApiProperty()
  orden: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
