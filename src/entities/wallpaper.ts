import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, ManyToOne, ManyToMany, CreateDateColumn } from 'typeorm';
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
  likedBy: User[];

  @ManyToMany(() => User, user => user.recievedWallpapers)
  postedTo: User[];

  @CreateDateColumn()
  createdAt: Date;
}
