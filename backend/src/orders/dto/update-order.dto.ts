import { IsEnum } from 'class-validator';
import { OrderStatus } from '../constants/order-status.enum';

export class UpdateOrderDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
