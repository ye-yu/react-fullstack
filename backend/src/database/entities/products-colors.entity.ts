import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { ColorsEntity } from './product-color.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'products_colors' })
export class ProductsColorsEntity {
  @PrimaryColumn()
  productsId: number;

  @PrimaryColumn()
  colorsId: number;

  @OneToOne(() => ColorsEntity)
  @JoinColumn({
    name: 'colorsId',
  })
  color: ColorsEntity;

  @OneToOne(() => ProductEntity)
  @JoinColumn({
    name: 'productsId',
  })
  product: ProductEntity;
}
