import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { BrandEntity } from './entities/brand.entity';
import { ProductEntity } from './entities/product.entity';
import { CategoryEntity } from './entities/category.entity';
import { ColorsEntity } from './entities/product-color.entity';
import { OrderHistoryEntity } from './entities/order.entity';
import { CreateTables1683420792527 } from './migrations/1683420792527-CreateTables';
import { ProductsColorsEntity } from './entities/products-colors.entity';
config();

export const defaultDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [
    BrandEntity,
    ProductEntity,
    CategoryEntity,
    ColorsEntity,
    OrderHistoryEntity,
    ProductsColorsEntity,
  ],
  migrations: [CreateTables1683420792527],
});
