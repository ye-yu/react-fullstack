import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { BrandEntity } from './entities/brand.entity';
import { ProductEntity } from './entities/product.entity';
import { CategoryEntity } from './entities/category.entity';
import { ProductColorsEntity } from './entities/product-color.entity';
config();

export const defaultDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [BrandEntity, ProductEntity, CategoryEntity, ProductColorsEntity],
  migrations: [],
});
