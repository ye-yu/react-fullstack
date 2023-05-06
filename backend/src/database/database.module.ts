import { Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource, Repository } from 'typeorm';
import { DatabaseConfig } from './database.config';
import { NoArgConstructor } from 'src/common/types/no-arg-constructor.type';
import { EntitiesToken } from './constants/entities-token.constant';
import { BrandEntity } from './entities/brand.entity';
import { ProductEntity } from './entities/product.entity';
import { BrandRepo } from './repos/brand.repo';
import { ProductRepo } from './repos/product.repo';
import { SingleArgConstructor } from 'src/common/types/single-arg-constructor.type';

const repositories: SingleArgConstructor<DataSource, Repository<any>>[] = [
  BrandRepo,
  ProductRepo,
];

@Module({
  providers: [
    {
      provide: DataSource,
      useFactory(
        configService: ConfigService<DatabaseConfig, true>,
        entities: NoArgConstructor[],
      ): DataSource {
        const databaseUrl = configService.get('DATABASE_URL');

        return new DataSource({
          type: 'postgres',
          url: databaseUrl,
          entities,
        });
      },
      inject: [ConfigService, EntitiesToken],
    },
    {
      provide: EntitiesToken,
      useValue: [BrandEntity, ProductEntity],
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
