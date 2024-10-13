import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ClientDto } from 'src/module/client/dto/client-dto';
import { ProductDto } from 'src/module/product/dto/product-dto';
import { Product } from 'src/module/product/entity/product.entity';
import { JoinTable, ManyToMany } from 'typeorm';

export class OrderDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createAt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  updateAt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  confirmAt?: Date;

  @IsNotEmpty()
  @Type(() => ClientDto)
  client!: ClientDto;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => ProductDto)
  products!: ProductDto[];
}
