import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

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
}

export default User;