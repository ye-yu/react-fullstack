import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinColumn,
} from 'typeorm';
import { ProductEntity } from './product.entity';
import { CategoryEntity } from './category.entity';

@Entity({ name: 'brands' })
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

  @ManyToMany(() => CategoryEntity, (category) => category.brands)
  @JoinColumn({
    name: 'categoryId',
  })
  categories: CategoryEntity[];
}
