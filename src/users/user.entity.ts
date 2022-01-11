import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Unique(['email'])
  @Column()
  email: string;

  @Column()
  displayName: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ default: `now()`, nullable: true })
  createdAt: string;

  @UpdateDateColumn({
    default: `now()`,
    nullable: true,
  })
  updatedAt: string;

  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
}
