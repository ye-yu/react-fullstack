import { Injectable } from '@nestjs/common';
import { ProductRepo } from '../database/repos/product.repo';
import { FilterOptionDto } from './dto/filter-option.dto';
import { ProductEntity } from '../database/entities/product.entity';
import { FindOptionsWhere, ILike, In, MoreThan } from 'typeorm';
import { PaginationOptionDto } from './dto/pagination-options.dao';
import { PaginationResults } from './dao/pagination-results.dao';

@Injectable()
export class ProductsService {
  constructor(readonly productsRepo: ProductRepo) {}

  async paginate(
    filter: FilterOptionDto,
    paginationOption: PaginationOptionDto,
  ): Promise<PaginationResults<ProductEntity>> {
    const where: FindOptionsWhere<ProductEntity> = {
      stockCount: MoreThan(0),
    };

    if (filter.categoryIds) {
      where.categoryId = In(filter.categoryIds);
    }

    if (filter.brandIds) {
      where.brandId = In(filter.brandIds);
    }

    if (filter.colorIds) {
      where.colors = {
        id: In(filter.colorIds),
      };
    }

    if (filter.name) {
      where.name = ILike(`%${filter.name}%`);
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
