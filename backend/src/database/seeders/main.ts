import { NestFactory } from '@nestjs/core';
import { DatabaseModule } from '../database.module';
import { SeederType } from './seeder.type';
import { NoArgConstructor } from '../../common/types/no-arg-constructor.type';
import { DataSource, Repository } from 'typeorm';
import { InitialSeed } from './01-InitialSeed';

async function bootstrap() {
  const app = await NestFactory.create(DatabaseModule);
  await app.init();
  const datasource: DataSource = app.get(DataSource);
  const seeders: SeederType[] = [InitialSeed];
  for (const seeder of seeders) {
    await seeder.seed(
      <T>(entity: NoArgConstructor<T>): Repository<T> =>
        datasource.getRepository(entity),
    );
  }
  await app.close();
}
bootstrap();
