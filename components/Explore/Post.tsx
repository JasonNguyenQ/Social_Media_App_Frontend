import { PostProps } from "../../constants/types";
import { FileBlobToURL } from "../../utilities/URL";
import Person_Icon from "/person_icon.svg"
import Send_Icon from "/send_icon.svg"
import "./Post.css"

export default function Post( {PostInfo} : {PostInfo: PostProps}){
    const {
        profilePicture,
        from,
        title,
        image,
        caption,
        createdAt
    } = PostInfo;
    
    const timestamp = new Date(createdAt)
    const date = (
        timestamp.toLocaleDateString() == new Date().toLocaleDateString()
    ) ? timestamp.toLocaleTimeString() : timestamp.toLocaleDateString()
    
    return (
        <div className="post">
            <span className="date">{date}</span>
            <header>
                <img src={FileBlobToURL(profilePicture, Person_Icon)} className="profile-picture"/>
                <div className="metadata">
                    <h2>{title}</h2>
                    <span>@{from}</span>
                </div>
            </header>
            <img src={FileBlobToURL(image)} className="image"/>
            <div className="caption">{caption}</div>
            <div className="input-container">
                <input placeholder="Comment..."></input>
                <button><img src={Send_Icon} alt="Send"/></button>
            </div>
            <div className="actions"></div>
            <ul className="comments"></ul>
        </div>
    );
}