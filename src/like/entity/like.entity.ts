import { Comment } from "src/comment/entity/comment.entity";
import { BaseEntity } from "src/common/entity/base.entity";
import { Post } from "src/post/entity/post.entity";
import { User } from "src/user/entity/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";

@Entity('likes')
@Unique(['userId', 'postId'])
@Unique(['userId', 'commentId'])
export class Like extends BaseEntity {
    @ManyToOne(() => User, { eager: false })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: number;

    @ManyToOne(() => Post, (post) => post.likes, { eager: false })
    @JoinColumn({ name: 'postId' })
    post: Post;

    @Column({ nullable: true })
    postId: number | null;

    @ManyToOne(() => Comment, (comment) => comment.likes, { eager: false })
    @JoinColumn({ name: 'commentId' })
    comment: Comment;

    @Column({ nullable: true })
    commentId: number | null;

}
