import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';
import { Wallpaper } from './wallpaper';

export enum FriendRequestStatus {
  NOT_SENT,
  PENDING,
  ACCEPTED,
  REJECTED,
}

@Entity()
export class FriendRequest extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: FriendRequestStatus;

  @ManyToOne(() => User, user => user.sentFriendRequests)
  from: User;

  @ManyToOne(() => User, user => user.receivedFriendRequests)
  to: User;
}
