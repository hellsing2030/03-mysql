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
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product-dto';
import { StockDto } from './dto/stock-dto';

@Controller('api/v1/products')
@ApiTags('Productos')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  @ApiOperation({
    description: 'crear producto en la base de datos de MySql',
  })
  @ApiBody({
    description: 'crear un producto mediante el ProductDTO',
    type: ProductDto,
    examples: {
      example1: {
        value: {
          id: 3,
          name: 'producto 4',
          price: 30,
          stock: 5,
        },
      },
      example2: {
        value: {
          name: 'producto 5',
          price: 30,
          stock: 5,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'el Producto se ha creado Correctamente',
  })
  @ApiResponse({
    status: 409,
    description: 'El Producto Existe',
  })
  createProduct(@Body() product: ProductDto) {
    return this.productService.createProduct(product);
  }

  @Get()
  @ApiOperation({
    description: 'Obtienes todos los productos no borrados ',
  })
  @ApiResponse({
    status: 201,
    description: 'Devuelve la informacion solicitada',
  })
  getProduct() {
    return this.productService.findAll();
  }

  @Get('/delete')
  @ApiOperation({
    description: 'Obtienes todos los productos borrados',
  })
  getProductsDeleted() {
    return this.productService.findAllDeleted();
  }

  @Get(`/:id`)
  @ApiOperation({
    description: 'Obtiene un producto mediante su ID',
  })
  @ApiParam({
    name: 'id',
    description: 'id del Producto',
    required: true,
    type: Number,
  })
  getProductById(@Param(`id`) id: number) {
    return this.productService.findProduct(id);
  }

  @Put()
  @ApiOperation({
    description: 'Actualiza el producto desde el body',
  })
  @ApiBody({
    description:
      'Actualiza un producto desde ProductDto, si no existe se crea.',
    type: ProductDto,
    examples: {
      example1: {
        value: {
          id: 3,
          name: 'producto 10',
          price: 30,
          stock: 20,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Sea actualizado correctamente',
  })
  updateProduct(@Body() product: ProductDto) {
    return this.productService.updateProduct(product);
  }

  @Delete('/:id')
  @ApiOperation({
    description: 'Borra un Producto pasandole un ID, es borrado suave',
  })
  @ApiResponse({
    status: 201,
    description: 'Se Borro el Producto Correctente',
  })
  @ApiResponse({
    status: 409,
    description: `El Producto no Existe <br> El Producto Ya esta Borrado <br>`,
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'id del producto',
    type: Number,
  })
  deleteProduct(@Param(`id`) id: number) {
    return this.productService.softDelete(id);
  }

  @Patch('/restore/:id')
  @ApiOperation({
    description:
      'Restaura un Producto que fue eliminado mediante el borrado Suave',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'id del producto',
    type: Number,
  })
  @ApiResponse({
    status: 201,
    description: 'Se ha restaurado Correctamente',
  })
  @ApiResponse({
    status: 409,
    description: `El Producto no Existe <br> El Producto No esta Borrado <br>`,
  })
  restoreProduct(@Param('id') id: number) {
    return this.productService.restoreProduct(id);
  }

  @Patch('/stock')
  @ApiOperation({
    description: 'Actualiza el stock de un producto ',
  })
  @ApiResponse({
    status: 201,
    description: 'Se ha Actualizado el Stock Correctamente',
  })
  @ApiBody({
    description: 'Actualiza el Stock mediante StockDto si existe el producto.',
    type: StockDto,
    examples: {
      example1: {
        value: {
          stock: 100,
          id: 1,
        },
      },
    },
  })
  updateStock(@Body() stock: StockDto) {
    return this.productService.updateStock(stock);
  }

  @Patch('/increment-stock')
  @ApiOperation({
    description: 'Incrementa el Stock de el producto Mediante el StockDTO.',
  })
  @ApiBody({
    description:
      'Actualiza el Stock mediante StockDto si existe el producto, tiene un limite para incrementar de 1000',
    type: StockDto,
    examples: {
      example1: {
        value: {
          stock: 100,
          id: 1,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Se ha incrementado Correctamente',
  })
  @ApiResponse({
    status: 409,
    description: `El Producto NO existe <br> el Producto esta Borrado<br>`,
  })
  incrementStock(@Body() stock: StockDto) {
    return this.productService.incrementStock(stock);
  }

  @Patch('/decrement-stock')
  @ApiOperation({
    description: 'Decrementa el Stock de el producto Mediante el StockDTO',
  })
  @ApiBody({
    description:
      'Actualiza el Stock mediante StockDto si existe el producto, tiene un limite para decrementar de 0',
    type: StockDto,
    examples: {
      example1: {
        value: {
          stock: 100,
          id: 1,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Se ha Decrementado Correctamente',
  })
  @ApiResponse({
    status: 409,
    description: `El Producto NO existe <br> el Producto esta Borrado<br>`,
  })
  decrementeStock(@Body() stock: StockDto) {
    return this.productService.decrementStock(stock);
  }
}
