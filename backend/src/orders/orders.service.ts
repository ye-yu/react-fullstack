import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ProductRepo } from '../database/repos/product.repo';
import { OrderHistoryRepo } from '../database/repos/order-history.repo';
import { OrderHistoryEntity } from '../database/entities/order.entity';
import { DataSource, Equal } from 'typeorm';
import { OrderStatus } from './constants/order-status.enum';
import { ProductEntity } from '../database/entities/product.entity';
import { PaginationOptionDto } from '../products/dto/pagination-options.dao';
import { PaginationResults } from '../products/dao/pagination-results.dao';

@Injectable()
export class OrdersService {
  constructor(
    readonly productsRepo: ProductRepo,
    readonly orderHistoryRepo: OrderHistoryRepo,
    readonly dataSource: DataSource,
  ) {}
  async create(createOrderDto: CreateOrderDto): Promise<OrderHistoryEntity> {
    const product = await this.productsRepo.findOne({
      where: {
        id: Equal(createOrderDto.productId),
        colors: {
          id: Equal(createOrderDto.colorId),
        },
      },
      relations: {
        colors: true,
      },
    });

    if (!product)
      throw new NotFoundException(
        {
          message: `product id of ${createOrderDto.productId} is not found`,
          productId: createOrderDto.productId,
          colorId: createOrderDto.colorId,
        },
        'Not Found',
      );

    if (product.stockCount <= 0) {
      throw new BadRequestException(
        {
          message: `the store has ran out of stock for product ${product.id}`,
          productId: createOrderDto.productId,
        },
        'Out of Stock',
      );
    }

    return await this.dataSource.transaction(async (em) => {
      const productRepo = em.getRepository(ProductEntity);
      await productRepo.decrement(
        {
          id: Equal(product.id),
        },
        'stockCount',
        1,
      );

      const orderHistory: Omit<OrderHistoryEntity, 'id'> = {
        orderId:
          `O` +
          `-${product.productStringId}` +
          `-${Math.random().toString(26).substring(5).toUpperCase()}`,
        productStringId: product.productStringId,
        priceDuringOrderMYR: product.priceMYR,
        photosDuringOrder: product.photos,
        nameDuringOrder: product.name,
        colorDuringOrder:
          product.colors.find((e) => e.id === createOrderDto.colorId)?.name ??
          'not found',
        status: OrderStatus.Open,
        product,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const orderHistoryRepo = em.getRepository(OrderHistoryEntity);

      return orderHistoryRepo.save(orderHistory);
    });
  }

  findAll() {
    return this.orderHistoryRepo.find({});
  }

  async paginate(
    paginationOption: PaginationOptionDto,
  ): Promise<PaginationResults<OrderHistoryEntity>> {
    const total = await this.orderHistoryRepo.count({});
    const orderHistory = await this.orderHistoryRepo.find({
      take: paginationOption.size,
      skip: (paginationOption.page - 1) * paginationOption.size,
      order: {
        id: 'desc',
      },
    });

    const result: PaginationResults<OrderHistoryEntity> = {
      data: orderHistory,
      ...paginationOption,
      total,
    };
    return result;
  }
  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const status = updateOrderDto.status;

    const updateResult = await this.orderHistoryRepo.update(
      {
        id: Equal(id),
      },
      {
        status,
      },
    );

    if (updateResult.affected === 0) {
      throw new NotFoundException(
        {
          message: `order id of ${id} is not found`,
          orderId: id,
        },
        'Not Found',
      );
    }

    return true;
  }
}
