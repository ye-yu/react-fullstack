import { Injectable } from '@nestjs/common';
import { BrandEntity } from '../entities/brand.entity';
import { RepoFactory } from './repo.factory';

@Injectable()
export class BrandRepo extends RepoFactory(BrandEntity) {}
