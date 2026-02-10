import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/entity/base.entity';
import { Post } from 'src/post/entity/post.entity';

@Entity('categories')
export class Category extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => Post, (post) => post.category)
  posts: Post[];
}
