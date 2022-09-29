import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  ManyToMany,
  CreateDateColumn,
  JoinTable,
} from 'typeorm';
import { User } from './user';

@Entity()
export class Wallpaper extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  url: string;

  @ManyToOne(() => User, user => user.postedWallpapers)
  postedBy: User;

  @ManyToMany(() => User, user => user.likedWallpapers)
  @JoinTable()
  likedBy: User[];

  @ManyToMany(() => User, user => user.recievedWallpapers)
  @JoinTable()
  postedTo: User[];

  @CreateDateColumn()
  createdAt: Date;
}
