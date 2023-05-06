import { Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { BrandRepo } from './repos/brand.repo';
import { ProductRepo } from './repos/product.repo';
import { SingleArgConstructor } from 'src/common/types/single-arg-constructor.type';
import { defaultDataSource } from './database.source';

const repositories: SingleArgConstructor<DataSource, Repository<any>>[] = [
  BrandRepo,
  ProductRepo,
];

@Module({
  providers: [
    {
      provide: DataSource,
      useValue: defaultDataSource,
    },
    ...repositories,
  ],
  exports: [...repositories],
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
