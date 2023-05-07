import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
  OneToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { BrandEntity } from './brand.entity';
import { ColorsEntity } from './product-color.entity';
import { CategoryEntity } from './category.entity';

@Entity({ name: 'products' })
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  @Index({ unique: true })
  productStringId: string;

  @Column()
  priceMYR: number;

  @Column()
  name: string;

  @Column({ type: 'simple-array' })
  photos: string[];

  @Column()
  stockCount: number;

  @Column()
  categoryId: number;

  @Column()
  brandId: number;

  @Column()
  colorId: number;

  @ManyToOne(() => BrandEntity, (brand) => brand.products, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'brandId',
  })
  brand: BrandEntity;

  @ManyToMany(() => ColorsEntity, (color) => color.products, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({ name: 'products_colors' })
  colors: ColorsEntity[];

  @OneToOne(() => CategoryEntity, (category) => category.product)
  @JoinColumn({
    name: 'categoryId',
  })
  category: CategoryEntity;

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
