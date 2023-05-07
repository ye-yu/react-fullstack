import { Injectable } from '@nestjs/common';
import { RepoFactory } from './repo.factory';
import { ProductsColorsEntity } from '../entities/products-colors.entity';

@Injectable()
export class ProductsColorsRepo extends RepoFactory(ProductsColorsEntity) {}
