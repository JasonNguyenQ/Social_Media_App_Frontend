import { Link } from "react-router-dom";
import { CommentProps } from "../../constants/types";
import { FileBlobToURL } from "../../utilities/URL";
import Person_Icon from "/person_icon.svg"

export default function Comment({Comment}: {Comment: CommentProps}){
    const {
        id,
        profilePicture,
        from,
        comment,
        createdAt,
    } = Comment;

    const timestamp = new Date(createdAt)
    const date = (
        timestamp.toLocaleDateString() == new Date().toLocaleDateString()
    ) ? timestamp.toLocaleTimeString() : timestamp.toLocaleDateString()

    return (
        <div className="comment">
            <header>
                    <div className="comment-info">
                        <Link to={`/search/${id}`}>
                            <img src={FileBlobToURL(profilePicture, Person_Icon)} className="comment-pfp"/>
                        </Link>
                        <span>{from}</span>
                    </div>
                    <span className="comment-date">{date}</span>
            </header>
            <p>{comment}</p>
        </div>
    );
}