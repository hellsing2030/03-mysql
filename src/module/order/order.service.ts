import { ConflictException, Injectable } from '@nestjs/common';
import { ClientService } from '../client/client.service';
import { ProductService } from '../product/product.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { OrderDto } from './dto/order-dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private clientService: ClientService,
    private ProductService: ProductService,
  ) {}

  async createOrder(order: OrderDto) {
    const clientExist = await this.clientService.getClientById(order.client.id);

    if (!clientExist) {
      throw new ConflictException(
        `El Cliente con el id ${order.client.id} no existe`,
      );
    }

    for (const p of order.products) {
      const product = await this.ProductService.findProduct(p.id);

      if (!product) {
        throw new ConflictException(`El producto con el id ${p.id} no existe`);
      } else if (product.deleted) {
        throw new ConflictException(
          `El producto con el id ${p.id} esta borrado`,
        );
      }
    }
    return this.orderRepository.save(order);
  }

  getOrderbyId(id: string) {
    return this.orderRepository.findOne({ where: { id } });
  }

  getPendingOrders() {
    return this.orderRepository.find({
      where: {
        confirmAt: IsNull(),
      },
    });
  }

  getConfirmedOrders() {
    return this.orderRepository.find({
      where: {
        confirmAt: Not(IsNull()),
      },
    });
  }
}
