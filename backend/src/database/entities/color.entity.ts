import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity({ name: 'colors' })
export class ColorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => ProductEntity, (product) => product.colors, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  products: ProductEntity[];

  @Column({
    type: 'datetime',
  })
  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'datetime',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
