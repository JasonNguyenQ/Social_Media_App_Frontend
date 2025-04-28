import { CommentProps, PostProps } from "../../constants/types";
import { FileBlobToURL } from "../../utilities/URL";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Person_Icon from "/person_icon.svg"
import Send_Icon from "/send_icon.svg"
import Comment_Icon from "/comment_icon.svg"
import Like_Icon from "/like_icon.svg"
import Up_Icon from "/up_icon.svg"
import Down_Icon from "/down_icon.svg"
import "./Post.css"
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Comment from "./Comment"
import { useToggle } from "../../hooks/useToggle"
import { GetComments, CreateComment } from "../../api/posts";
import { GetReaction, CreateReaction, DeleteReaction } from "../../api/reactions";

export default function Post( {PostInfo} : {PostInfo: PostProps}){
    const {
        postId,
        id,
        profilePicture,
        from,
        title,
        image,
        caption,
        createdAt
    } = PostInfo;

    const queryClient = useQueryClient();
    const [Comments, setComments] = useState<CommentProps[]>([]);

    const { data: Reactions } = useQuery<string[]>({
		queryKey: ["postReactions", {postId}],
		queryFn: async ()=>{return await GetReaction({type: "post", id: postId})},
		initialData: [],
	});

    const { mutate: handleReaction } = useMutation({
        mutationFn: async (reaction: string) => {
            if(!Reactions.includes(reaction)) await CreateReaction({type: "post", id: postId, reaction: reaction})
            else await DeleteReaction({type: "post", id: postId, reaction: reaction})
        },
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: ["postReactions", {postId}]
            })
        }
    })
    
    const [toggleState, Toggle] = useToggle(false, 100);
    const textInput = useRef<HTMLInputElement>(null);
    const timestamp = new Date(createdAt)
    const date = (
        timestamp.toLocaleDateString() == new Date().toLocaleDateString()
    ) ? timestamp.toLocaleTimeString() : timestamp.toLocaleDateString()

    async function AddComment(){
        const comment = textInput.current!.value
        if (comment === "") return;
        await CreateComment({postId: postId, comment: comment})
        textInput.current!.value = ""
    }
    
    async function fetchComments(){
        const postComments = await GetComments(postId)
        setComments(postComments)
        Toggle()
    }
    
    return (
        <div className="post">
            <span className="date">{date}</span>
            <header>
                <Link to={`/search/${id}`}>
                    <img src={FileBlobToURL(profilePicture, Person_Icon)} className="profile-picture"/>
                </Link>
                <div className="metadata">
                    <h2>{title}</h2>
                    <span>@{from}</span>
                </div>
            </header>
            <img src={FileBlobToURL(image)} className="image"/>
            <div className="caption">{caption}</div>
            <div className="input-container">
                <input placeholder="Comment..." type="text" ref={textInput}></input>
                <button onClick={AddComment}><img src={Send_Icon} alt="Send"/></button>
            </div>
            <div className="post-actions">
                <div className="post-action" onClick={()=>{handleReaction("Like")}}>
                    <img src={Like_Icon}/>
                    <span>{Reactions.includes("Like") ? "Unlike" : "Like"}</span>
                </div>
                <div className="post-action" onClick={fetchComments}>
                    <img src={Comment_Icon}/>
                    <span>Comments</span>
                    <img src={(toggleState) ? Up_Icon : Down_Icon}/>
                </div>
            </div>
            {toggleState && 
                <ul className="comments">
                    {Comments.map((comment, index)=>{
                        return <Comment Comment={comment} key={index}></Comment>
                    })}
                </ul>
            }
        </div>
    );
}