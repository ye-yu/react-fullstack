import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
  OneToOne,
} from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity({ name: 'order_history' })
export class OrderHistoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  @Index({ unique: true })
  orderId: string;

  @Column({ length: 100 })
  productStringId: string;

  @Column()
  priceDuringOrderMYR: number;

  @Column({ type: 'simple-array' })
  photosDuringOrder: string[];

  @Column()
  nameDuringOrder: string;

  @Column()
  status: string;

  @Column({
    type: 'datetime',
  })
  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'datetime',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => ProductEntity, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'productStringId',
    referencedColumnName: 'productStringId',
  })
  product?: ProductEntity;
}
