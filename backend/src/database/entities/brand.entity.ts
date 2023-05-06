import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity()
export class BrandEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

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

  @OneToMany(() => ProductEntity, (product) => product.brand)
  products: ProductEntity;
}
