import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id?: Number;

  @Column({ type: String, nullable: false, length: 30 })
  name!: string;

  @Column({ type: String, nullable: false, unique: true, length: 30 })
  email!: string;
}
