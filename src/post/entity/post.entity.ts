import { Category } from "src/category/entity/category.entity";
import { User } from "src/user/entity/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "src/common/entity/base.entity";

@Entity('posts')
export class Post extends BaseEntity {
    @Column()
    title: string;

    @Column({ type: 'text' })
    content: string;

    @Column({ default: 0 })
    viewCount: number;

    @ManyToOne(() => User, { eager: false }) // Lazy Loading : 필요할때만 로딩
    @JoinColumn({ name: 'authorId' })
    author: User;

    @Column()
    authorId: number;

    @ManyToOne(() => Category, (category) => category.posts, { eager: false })
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    @Column()
    categoryId: number;

    @OneToMany(() => Comment, (comment) => comment.post)
    comments: Comment[];

    @OneToMany(() => Like, (like) => like.post)
    likes: Like[];



}