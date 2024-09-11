import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product-dto';
import { StockDto } from './dto/stock-dto';

@Controller('api/v1/products')
@ApiTags('Productos')
export class ProductController {
  constructor(private productService: ProductService) {}
  @Post()
  createProduct(@Body() product: ProductDto) {
    return this.productService.createProduct(product);
  }

  @Get()
  getProduct() {
    return this.productService.findAll();
  }

  @Get('/delete')
  getProductsDeleted() {
    return this.productService.findAllDeleted();
  }

  @Get(`/:id`)
  getProductById(@Param(`id`) id: number) {
    return this.productService.findProduct(id);
  }

  @Put()
  updateProduct(@Body() product: ProductDto) {
    return this.productService.updateProduct(product);
  }

  @Delete('/:id')
  deleteProduct(@Param(`id`) id: number) {
    return this.productService.softDelete(id);
  }

  @Patch('/restore/:id')
  restoreProduct(@Param('id') id: number) {
    return this.productService.restoreProduct(id);
  }

  @Patch('/stock')
  updateStock(@Body() stock: StockDto) {
    return this.productService.updateStock(stock);
  }

  @Patch('/increment-stock')
  incrementStock(@Body() stock: StockDto) {
    return this.productService.incrementStock(stock);
  }

  @Patch('/decrement-stock')
  decrementeStock(@Body() stock: StockDto) {
    return this.productService.decrementStock(stock);
  }
}
