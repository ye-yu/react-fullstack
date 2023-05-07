import { Body, Controller, HttpCode, Post, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { FilterOptionDao } from './dao/filter-option.dao';
import { ToNumber } from '../common/pipes/to-number.pipe';
import { PaginationOption } from './dao/pagination-options.dao';
import { RequestUrl } from '../common/decorators/request-url.decorator';

@Controller({
  version: '1',
  path: 'products',
})
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(200)
  async findAll(
    @Body() filter: FilterOptionDao,
    @Query(
      'page',
      ToNumber(1, {
        maxDecimalPlaces: 0,
      }),
    )
    page: number,
    @Query(
      'size',
      ToNumber(5, {
        maxDecimalPlaces: 0,
      }),
    )
    size: number,
    @RequestUrl(true) requestUrl: string,
  ) {
    const paginationOption: PaginationOption = {
      page,
      size,
    };
    const { data: results, ...paginationInfo } =
      await this.productsService.paginate(filter, paginationOption);
    const hasNextPage =
      paginationInfo.page * paginationInfo.size < paginationInfo.total;
    const hasPreviousPage = paginationInfo.page > 1;
    return {
      results,
      ...paginationInfo,
      nextPageUrl: hasNextPage
        ? `${requestUrl}?page=${page + 1}&size=${size}`
        : null,
      previousPageUrl: hasPreviousPage
        ? `${requestUrl}?page=${page - 1}&size=${size}`
        : null,
    };
  }
}
