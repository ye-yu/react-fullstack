import { Injectable } from '@nestjs/common';
import { RepoFactory } from './repo.factory';
import { ColorEntity } from '../entities/color.entity';

@Injectable()
export class ColorsRepo extends RepoFactory(ColorEntity) {}
