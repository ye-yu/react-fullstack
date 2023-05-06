import { Injectable } from '@nestjs/common';
import { ProductEntity } from '../entities/product.entity';
import { RepoFactory } from './repo.factory';

@Injectable()
export class ProductRepo extends RepoFactory(ProductEntity) {}
