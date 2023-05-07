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
import { ColorEntity } from '../database/entities/color.entity';
import { ProductsColorsRepo } from '../database/repos/product-colors.repo';
import { ProductsColorsEntity } from '../database/entities/products-colors.entity';

@Injectable()
export class ProductsService {
  constructor(
    readonly productsRepo: ProductRepo,
    readonly brandRepo: BrandRepo,
    readonly colorRepo: ColorsRepo,
    readonly categoryRepo: CategoryRepo,
    readonly productsColorsRepo: ProductsColorsRepo,
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
  ): Promise<PaginationResults<ProductEntity & { color: ColorEntity }>> {
    const whereProduct: FindOptionsWhere<ProductEntity> = {
      stockCount: MoreThan(0),
    };

    const whereProductColor: FindOptionsWhere<ProductsColorsEntity> = {};

    if (filter.categoryIds) {
      whereProduct.categoryId = In(filter.categoryIds);
    }

    if (filter.brandIds) {
      whereProduct.brandId = In(filter.brandIds);
    }

    if (filter.colorIds) {
      whereProductColor.colorsId = In(filter.colorIds);
    }

    if (filter.name) {
      whereProduct.name = ILike(`%${filter.name}%`);
    }

    const total = await this.productsColorsRepo.count({
      where: {
        product: whereProduct,
        ...whereProductColor,
      },
      relations: {
        product: {
          category: true,
          brand: true,
        },
        color: true,
      },
    });

    const productsColors = await this.productsColorsRepo.find({
      where: {
        product: whereProduct,
        ...whereProductColor,
      },
      take: paginationOption.size,
      skip: (paginationOption.page - 1) * paginationOption.size,
      relations: {
        product: {
          category: true,
          brand: true,
        },
        color: true,
      },
      order: {
        productsId: 'desc',
      },
    });

    const products = productsColors.reduce((a, b, i) => {
      a[i] = {
        ...b.product,
        color: b.color,
      };
      return a;
    }, Array.from(productsColors) as unknown as Array<ProductEntity & { color: ColorEntity }>);

    const result: PaginationResults<ProductEntity & { color: ColorEntity }> = {
      data: products,
      ...paginationOption,
      total,
    };
    return result;
  }
}
