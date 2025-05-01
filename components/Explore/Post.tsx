import { CommentProps, PostProps, UserIdentifier } from "../../constants/types";
import { FileBlobToURL } from "../../utilities/URL";
import { keepPreviousData, useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import Person_Icon from "/person_icon.svg"
import Send_Icon from "/send_icon.svg"
import Comment_Icon from "/comment_icon.svg"
import Like_Icon from "/like_icon.svg"
import Up_Icon from "/up_icon.svg"
import Down_Icon from "/down_icon.svg"
import "./Post.css"
import { useRef } from "react";
import { Link } from "react-router-dom";
import Comment from "./Comment"
import { useToggle } from "../../hooks/useToggle"
import { GetComments, CreateComment, CountComments } from "../../api/posts";
import { GetReaction, CreateReaction, DeleteReaction, CountReaction } from "../../api/reactions";
import { NumericalAbbr } from "../../utilities/Abbreviation";
import { ACCESS_KEY, AUTH_VALIDATION_TIME } from '../../constants/globals'
import Authorize from "../../api/Auth";

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

    const token = sessionStorage.getItem(ACCESS_KEY)

    const [
        { data: userInfo },
        { data: Comments, refetch: refetchComments },
        { data: Reactions },
        { data: nLikes },
        { data: nComments }
    ] : [
        { data: UserIdentifier },
        { data: CommentProps[], refetch: Function },
        { data: string[] },
        { data: number },
        { data: number }
    ] = useQueries({
        queries: [
            {
                queryKey: ["auth", {token}],
                queryFn: async () => await Authorize(token),
                refetchInterval: AUTH_VALIDATION_TIME,
                staleTime: AUTH_VALIDATION_TIME
            },
            {
                queryKey: ["postComments", {postId}],
                queryFn: async () => await GetComments(postId),
                placeholderData: keepPreviousData,
                enabled: false,
            },
            {
                queryKey: ["postReactions", {postId}],
                queryFn: async () => await GetReaction({type: "post", id: postId}),
                placeholderData: keepPreviousData,
            },
            {
                queryKey: ["postNLikes", {postId}],
                queryFn: async () => await CountReaction({type: "post", id: postId, reaction: "Like"}),
                placeholderData: keepPreviousData,
            },
            {
                queryKey: ["postNComments", {postId}],
                queryFn: async ()=>{return await CountComments(postId)},
                placeholderData: keepPreviousData,
            }
        ]
    })

    const loggedIn = userInfo?.id !== -1

    const { mutate: handleReaction } = useMutation({
        mutationFn: async (reaction: string) => {
            if(!loggedIn) return
            if(!Reactions?.includes(reaction)){
                await CreateReaction({type: "post", id: postId, reaction: reaction})
                queryClient.setQueryData(["postReactions", {postId}], ()=>{
                    if(Reactions) return [...Reactions, "Like"]
                    return ["Like"]
                })
                queryClient.setQueryData(["postNLikes", {postId}], (nLikes || 0)+1)
            }
            else {
                await DeleteReaction({type: "post", id: postId, reaction: reaction})
                queryClient.setQueryData(["postReactions", {postId}], Reactions?.filter((reaction)=>reaction !== "Like"))
                queryClient.setQueryData(["postNLikes", {postId}], (nLikes || 1)-1)
            }
        },
    })

    const { mutate: handleComments } = useMutation({
        mutationFn: async ()=>{
            const comment = textInput.current!.value
            if (comment === "") return;
            await CreateComment({postId: postId, comment: comment})
            textInput.current!.value = ""
        },
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: ["postNComments", {postId}]
            })
            refetchComments()
        }
    })
    
    const [toggleState, Toggle] = useToggle(false, 100);
    const textInput = useRef<HTMLInputElement>(null);
    const timestamp = new Date(createdAt)
    const date = (
        timestamp.toLocaleDateString() == new Date().toLocaleDateString()
    ) ? timestamp.toLocaleTimeString() : timestamp.toLocaleDateString()
    
    async function fetchComments(){
        Toggle()
        if (queryClient.getQueryData(["postComments", {postId}])) return
        refetchComments()
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
                <input placeholder="Comment..." type="text" ref={textInput} disabled={!loggedIn}></input>
                <button onClick={()=>{handleComments()}}><img src={Send_Icon} alt="Send"/></button>
            </div>
            <div className="post-actions">
                <div className="post-action" onClick={()=>{handleReaction("Like")}}>
                    <img src={Like_Icon}/>
                    <span>{NumericalAbbr(nLikes)} • {Reactions?.includes("Like") ? "Unlike" : "Like"}</span>
                </div>
                <div className="post-action" onClick={fetchComments}>
                    <img src={Comment_Icon}/>
                    <span>{NumericalAbbr(nComments)} • Comments</span>
                    <img src={(toggleState) ? Up_Icon : Down_Icon}/>
                </div>
            </div>
            {toggleState && 
                <ul className="comments">
                    {Comments?.map((comment, index)=>{
                        return <Comment Comment={comment} key={index}></Comment>
                    })}
                </ul>
            }
        </div>
    );
}