import { BaseEntity, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FriendRequest } from './friendRequest';
import { Token } from './token';
import { Wallpaper } from './wallpaper';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  description: string;

  @Column()
  clientToken?: string;

  @OneToMany(() => Wallpaper, wallpaper => wallpaper.postedBy)
  postedWallpapers: Wallpaper[];

  @ManyToMany(() => Wallpaper, wallpaper => wallpaper.likedBy)
  likedWallpapers: Wallpaper[];

  @ManyToMany(() => Wallpaper, wallpaper => wallpaper.postedTo)
  recievedWallpapers: Wallpaper[];

  @OneToMany(() => FriendRequest, friendRequest => friendRequest.from)
  sentFriendRequests: FriendRequest[];

  @OneToMany(() => FriendRequest, friendRequest => friendRequest.to)
  receivedFriendRequests: FriendRequest[];

  @OneToMany(() => Token, token => token.user)
  tokens: Token[];
}
