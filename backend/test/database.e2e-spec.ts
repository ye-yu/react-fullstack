import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { BrandRepo } from '../src/database/repos/brand.repo';

beforeEach(() => {
  process.env.DATABASE_URL = process.env.E2E_DATABASE_URL;
});

describe('Database', () => {
  let module: TestingModule;

  beforeEach(async () => {
    const moduleBuilder = Test.createTestingModule({
      imports: [AppModule],
    });

    module = await moduleBuilder.compile();
    await module.init();
  });

  afterEach(async () => {
    await module?.close();
    module = null;
  });

  it('can connect to database', async () => {
    const brandRepo = module.get(BrandRepo);
    const list = await brandRepo.query('SELECT 1');
    expect(list).not.toEqual(undefined);
  });
});
