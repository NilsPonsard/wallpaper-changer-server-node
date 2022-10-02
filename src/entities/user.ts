import { BaseEntity, Column, Entity, Index, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { FriendRequest } from './friendRequest';
import { Token } from './token';
import { Wallpaper } from './wallpaper';

@Unique("UQ_Username", ["username"])
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

  @Index()
  @Column({ nullable: true })
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
