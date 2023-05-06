import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { BrandEntity } from './brand.entity';

@Entity()
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  brandId: number;

  @ManyToOne(() => BrandEntity, (brand) => brand.products, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'brandId',
  })
  brand: BrandEntity;

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
}
