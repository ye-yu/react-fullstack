import { Injectable } from '@nestjs/common';
import { ProductRepo } from '../database/repos/product.repo';
import { FilterOptionDto } from './dto/filter-option.dto';
import { ProductEntity } from '../database/entities/product.entity';
import { FindOptionsWhere, ILike, In, MoreThan } from 'typeorm';
import { PaginationOptionDto } from './dto/pagination-options.dao';
import { PaginationResults } from './dao/pagination-results.dao';
import { BrandRepo } from '../database/repos/brand.repo';
import { ColorsRepo } from '../database/repos/colors.repo';
import { CategoryRepo } from '../database/repos/category.repo';
import { SearchOptions } from './dao/search-options.dao';

@Injectable()
export class ProductsService {
  constructor(
    readonly productsRepo: ProductRepo,
    readonly brandRepo: BrandRepo,
    readonly colorRepo: ColorsRepo,
    readonly categoryRepo: CategoryRepo,
  ) {}

  async searchOptions(): Promise<SearchOptions[]> {
    const nameSearchOptions: SearchOptions = {
      name: 'name',
      label: 'Product Name',
      placeholder: 'Enter Product Name',
      type: 'text',
      options: [],
    };

    const categories = await this.categoryRepo.find({});

    const categorySearchOptions: SearchOptions = {
      name: 'categoryIds',
      label: 'Category',
      placeholder: 'Select a Category',
      type: 'dropdown',
      options: categories.map((e) => ({
        id: e.id,
        label: e.name,
      })),
    };

    const brands = await this.brandRepo.find({});

    const brandSearchOptions: SearchOptions = {
      name: 'brandIds',
      label: 'Brand',
      placeholder: 'Select a Brand',
      type: 'dropdown',
      options: brands.map((e) => ({
        id: e.id,
        label: e.name,
      })),
    };

    const colors = await this.colorRepo.find({});

    const colorSearchOptions: SearchOptions = {
      name: 'colorIds',
      label: 'Color',
      placeholder: 'Select a Color',
      type: 'dropdown',
      options: colors.map((e) => ({
        id: e.id,
        label: e.name,
      })),
    };
    return [
      nameSearchOptions,
      categorySearchOptions,
      brandSearchOptions,
      colorSearchOptions,
    ];
  }

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
