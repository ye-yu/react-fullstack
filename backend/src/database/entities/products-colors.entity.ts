import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { ColorEntity } from './color.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'products_colors' })
export class ProductsColorsEntity {
  @PrimaryColumn()
  productsId: number;

  @PrimaryColumn()
  colorsId: number;

  @OneToOne(() => ColorEntity)
  @JoinColumn({
    name: 'colorsId',
  })
  color: ColorEntity;

  @OneToOne(() => ProductEntity)
  @JoinColumn({
    name: 'productsId',
  })
  product: ProductEntity;
}
