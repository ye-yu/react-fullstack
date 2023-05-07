import { Injectable } from '@nestjs/common';
import { RepoFactory } from './repo.factory';
import { ColorsEntity } from '../entities/product-color.entity';

@Injectable()
export class ColorsRepo extends RepoFactory(ColorsEntity) {}
