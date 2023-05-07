import { Injectable } from '@nestjs/common';
import { RepoFactory } from './repo.factory';
import { CategoryEntity } from '../entities/category.entity';

@Injectable()
export class CategoryRepo extends RepoFactory(CategoryEntity) {}
