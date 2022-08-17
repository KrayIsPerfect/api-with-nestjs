import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import PrivateFile from '../file/private.file.entity';
import PublicFile from '../file/public.file.entity';
import Post from '../post/post.entity';

import Address from './address.entity';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public email: string;

  @Column()
  public name: string;

  @Column()
  @Exclude()
  public password: string;

  @Column({
    nullable: true
  })
  @Exclude()
  public currentHashedRefreshToken?: string;

  @OneToOne(() => Address, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  public address: Address;

  @OneToMany(() => Post, (post: Post) => post.author)
  public posts: Post[];
  
  @JoinColumn()
  @OneToOne(
    () => PublicFile,
    {
      eager: true,
      nullable: true
    }
  )
  public avatar?: PublicFile | null;

  @OneToMany(
    () => PrivateFile,
    (file: PrivateFile) => file.owner
  )
  public files: PrivateFile[];
}

export default User;