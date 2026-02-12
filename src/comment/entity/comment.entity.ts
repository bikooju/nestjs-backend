import { BaseEntity } from "src/common/entity/base.entity";
import { Like } from "src/like/entity/like.entity";
import { Post } from "src/post/entity/post.entity";
import { User } from "src/user/entity/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

@Entity('comments')
export class Comment extends BaseEntity {
    @Column({ type: 'text' })
    content: string;

    @ManyToOne(() => User, { eager: false })
    @JoinColumn({ name: 'authorId' })
    author: User;

    @Column()
    authorId: number;

    @ManyToOne(() => Post, (post) => post.comments, { eager: false })
    @JoinColumn({ name: 'postId' })
    post: Post;

    @Column()
    postId: number;

    @OneToMany(() => Like, (like) => like.comment)
    likes: Like[];

}