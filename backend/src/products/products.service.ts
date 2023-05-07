import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepo } from '../database/repos/product.repo';
import { FilterOptionDao } from './dao/filter-option.dao';
import { ProductEntity } from '../database/entities/product.entity';
import { FindOptionsWhere, In } from 'typeorm';
import { PaginationOption } from './dao/pagination-options.dao';
import { PaginationResults } from './dao/pagination-results.dao';

@Injectable()
export class ProductsService {
  constructor(readonly productsRepo: ProductRepo) {}

  async paginate(
    filter: FilterOptionDao,
    paginationOption: PaginationOption,
  ): Promise<PaginationResults<ProductEntity>> {
    const where: FindOptionsWhere<ProductEntity> = {};
    if (filter.categoryIds) {
      where.categoryId = In(filter.categoryIds);
    }
    const total = await this.productsRepo.count({
      where,
    });
    const products = await this.productsRepo.find({
      where,
      take: paginationOption.size,
      skip: (paginationOption.page - 1) * paginationOption.size,
    });

    const result: PaginationResults<ProductEntity> = {
      data: products,
      ...paginationOption,
      total,
    };
    return result;
  }
}
