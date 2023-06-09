import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { FilterOptionDto } from './dto/filter-option.dto';
import { ToNumber } from '../common/pipes/to-number.pipe';
import { PaginationOptionDto } from './dto/pagination-options.dao';
import { RequestPath } from '../common/decorators/request-path.decorator';

@Controller({
  version: '1',
  path: 'products',
})
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('search-options')
  async getSearchOptions() {
    return {
      search: await this.productsService.searchOptions(),
    };
  }

  @Post()
  @HttpCode(200)
  async findAll(
    @Body() filter: FilterOptionDto,
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
    @RequestPath(true) requestUrl: string,
  ) {
    const paginationOption: PaginationOptionDto = {
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
