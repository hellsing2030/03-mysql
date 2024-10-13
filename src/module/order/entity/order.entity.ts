import { Client } from 'src/module/client/entity/client.entity';
import { Product } from 'src/module/product/entity/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @CreateDateColumn()
  createAt?: Date;

  @UpdateDateColumn()
  updateAt?: Date;

  @Column({ type: Date, nullable: true })
  confirmAt: Date;

  @ManyToOne(() => Client, (client) => client.orders, { eager: true })
  client!: Client;

  @ManyToMany(() => Product, { eager: true })
  @JoinTable({ name: 'order_products' })
  products: Product[];
}
