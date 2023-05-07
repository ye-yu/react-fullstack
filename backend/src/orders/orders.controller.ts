import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ToNumber } from '../common/pipes/to-number.pipe';
import { RequestPath } from '../common/decorators/request-path.decorator';
import { PaginationOptionDto } from '../products/dto/pagination-options.dao';

@Controller({
  version: '1',
  path: 'orders',
})
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll(
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
      await this.ordersService.paginate(paginationOption);
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

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Patch('/:id')
  update(
    @Param(
      'id',
      ToNumber(undefined, {
        maxDecimalPlaces: 0,
      }),
    )
    id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, updateOrderDto);
  }
}
