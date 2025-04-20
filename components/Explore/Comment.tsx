import { CommentProps } from "../../constants/types";

export default function Comment({Comment}: {Comment: CommentProps}){
    const {
        id,
        profilePicture,
        from,
        comment,
        createdAt,
    } = Comment;
    return <div>{from} says {comment}</div>
}