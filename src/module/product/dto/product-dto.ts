import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class ProductDto {
  @ApiProperty({
    name: 'id',
    required: false,
    description: ' Id del Producto',
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  id?: number;

  @ApiProperty({
    name: 'name',
    required: true,
    description: 'Nombre del Producto',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    name: 'price',
    required: true,
    description: 'Precio del Producto',
    type: Number,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  price!: number;

  @ApiProperty({
    name: 'stock',
    required: true,
    description: 'stock del Producto',
    type: Number,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  stock!: number;

  @ApiProperty({
    name: 'deleted',
    required: false,
    description: 'Indica si el Producto esta borrado',
    type: Boolean,
  })
  @IsBoolean()
  @IsOptional()
  deleted?: boolean;
}
