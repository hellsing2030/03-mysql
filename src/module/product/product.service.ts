import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entity/product.entity';
import { Repository, UpdateResult } from 'typeorm';
import { ProductDto } from './dto/product-dto';
import { StockDto } from './dto/stock-dto';

@Injectable()
export class ProductService {
  private MIN_STOCK: number = 0;
  private MAX_STOCK: number = 1000;

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}
  async createProduct(product: ProductDto) {
    const productExists: ProductDto = await this.findProduct(product.id);

    if (productExists)
      throw new ConflictException(
        'El Producto con el id ' + product.id + ' ya existe',
      );

    return await this.productRepository.save(product);
  }

  async findProduct(id: number) {
    return await this.productRepository.findOne({
      where: { id },
    });
  }

  findAll() {
    return this.productRepository.find({
      where: { deleted: false },
    });
  }

  async findAllDeleted() {
    return await this.productRepository.findOne({
      where: { deleted: true },
    });
  }

  async updateProduct(product: ProductDto) {
    return await this.productRepository.save(product);
  }

  async softDelete(id: number) {
    const productExists: ProductDto = await this.findProduct(id);

    if (!productExists) {
      throw new ConflictException('El Producto con el id ' + id + ' No existe');
    }

    if (productExists.deleted) {
      throw new ConflictException(
        `El Producto con el id ${id} se Encuentra Borrado`,
      );
    }

    const rows: UpdateResult = await this.productRepository.update(
      { id },
      { deleted: true },
    );

    return rows.affected == 1;
  }

  async restoreProduct(id: number) {
    const productExists: ProductDto = await this.findProduct(id);

    if (!productExists) {
      throw new ConflictException('El Producto con el id ' + id + ' No existe');
    }

    if (!productExists.deleted) {
      throw new ConflictException(`El Producto no esta borrado`);
    }

    const rows: UpdateResult = await this.productRepository.update(
      { id },
      { deleted: false },
    );

    return rows.affected == 1;
  }

  async updateStock(stock: StockDto) {
    const product: ProductDto = await this.findProduct(stock.id);

    if (!product) {
      throw new ConflictException(`El Producto Con id ${stock.id} no existe`);
    }
    if (product.deleted) {
      throw new ConflictException(
        `El Producto con el id ${stock.id} esta borrado`,
      );
    }

    const rows: UpdateResult = await this.productRepository.update(
      { id: stock.id },
      { stock: stock.stock },
    );

    return rows.affected == 1;
  }
  async incrementStock(stock: StockDto) {
    const product: ProductDto = await this.findProduct(stock.id);

    if (!product) {
      throw new ConflictException(`El Producto Con id ${stock.id} no existe`);
    }
    if (product.deleted) {
      throw new ConflictException(
        `El Producto con el id ${stock.id} esta borrado`,
      );
    }

    let stockState = 0;
    if (stock.stock + product.stock > this.MAX_STOCK) {
      stockState = this.MAX_STOCK;
    } else {
      stockState = stock.stock + product.stock;
    }
    const rows: UpdateResult = await this.productRepository.update(
      { id: stock.id },
      { stock: stockState },
    );

    return rows.affected == 1;
  }

  async decrementStock(stock: StockDto) {
    const product: ProductDto = await this.findProduct(stock.id);

    if (!product) {
      throw new ConflictException(`El Producto Con id ${stock.id} no existe`);
    }
    if (product.deleted) {
      throw new ConflictException(
        `El Producto con el id ${stock.id} esta borrado`,
      );
    }

    let stockState = product.stock;
    if (stockState - stock.stock < this.MIN_STOCK) {
      stockState = this.MIN_STOCK;
    } else {
      stockState -= stock.stock;
    }

    const rows: UpdateResult = await this.productRepository.update(
      { id: stock.id },
      { stock: stockState },
    );

    return rows.affected == 1;
  }
}
