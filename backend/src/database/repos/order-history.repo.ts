import { Injectable } from '@nestjs/common';
import { RepoFactory } from './repo.factory';
import { OrderHistoryEntity } from '../entities/order.entity';

@Injectable()
export class OrderHistoryRepo extends RepoFactory(OrderHistoryEntity) {}
