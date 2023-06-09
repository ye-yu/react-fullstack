import { Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { BrandRepo } from './repos/brand.repo';
import { ProductRepo } from './repos/product.repo';
import { SingleArgConstructor } from '../common/types/single-arg-constructor.type';
import { defaultDataSource } from './database.source';
import { OrderHistoryRepo } from './repos/order-history.repo';
import { ColorsRepo } from './repos/colors.repo';
import { CategoryRepo } from './repos/category.repo';
import { ProductsColorsRepo } from './repos/product-colors.repo';

const repositories: SingleArgConstructor<DataSource, Repository<any>>[] = [
  BrandRepo,
  ProductRepo,
  OrderHistoryRepo,
  ColorsRepo,
  CategoryRepo,
  ProductsColorsRepo,
];

@Module({
  providers: [
    {
      provide: DataSource,
      useValue: defaultDataSource,
    },
    ...repositories,
  ],
  exports: [DataSource, ...repositories],
})
export class DatabaseModule implements OnModuleInit, OnModuleDestroy {
  constructor(readonly dataSource: DataSource) {}
  async onModuleInit(): Promise<void> {
    await this.dataSource.initialize();
    return;
  }
  async onModuleDestroy(): Promise<void> {
    await this.dataSource.destroy();
    return;
  }
}
