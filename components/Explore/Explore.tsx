import { Helmet } from 'react-helmet-async';
import Navbar from '../Navbar/Navbar';
import { Link } from "react-router-dom"
import { APP_NAME } from '../../constants/globals'
import Right_Arrow_Icon from "/right_arrow_icon.svg"
import New_Tab_Icon from "/new_tab_icon.svg"
import Post from './Post.tsx'
import { GetPosts, CreatePost } from "../../api/posts.tsx"
import "./Explore.css"
import { FormEvent, useState } from 'react';
import { PostProps } from '../../constants/types.tsx';
import { useQuery } from '@tanstack/react-query';

export default function Explore(){
    const [toggleState, setToggleState] = useState(false);

    const { data: Posts } = useQuery<PostProps[]>({
		queryKey: ["posts"],
		queryFn: GetPosts,
		initialData: [],
	});

    async function AddPost(e: FormEvent<HTMLFormElement>){
        e.preventDefault()
        const formData = new FormData(e.currentTarget);
		const image = formData.get("image") as File;
		const data = new FormData();

        data.append("title", formData.get("title") as string)
        data.append("caption", formData.get("caption") as string)
        if (image.type.startsWith("image")) {
			data.append("image", image);
		}
        await CreatePost(data)
        setToggleState(false);
    }
    
    return (
        <div id="explore-page">
            <Helmet>
                <title>Explore | {APP_NAME}</title>
                <meta name='description' content='Explore a Wide Variety of User Created Content' />
            </Helmet>
            <Navbar/>
            <div className="explore-container">
                <ul className="actions">
                    <li>
                        Filters
                        <img src={Right_Arrow_Icon}/>
                        <div className="filters">
                            Placeholder
                        </div>
                    </li>
                    <li>
                        <Link to={""} target='_blank'>
                            How it works
                            <img src={New_Tab_Icon}/>
                        </Link>
                    </li>
                    <li>
                        <Link to={""} target='_blank'>
                            Rules and Regulations
                            <img src={New_Tab_Icon}/>
                        </Link>
                    </li>
                    <li>
                        <Link to={""} target='_blank'>
                            Report
                            <img src={New_Tab_Icon}/>
                        </Link>
                    </li>
                </ul>
                <div className="content-container">
                    {Posts.map((post)=>{
                        return <Post PostInfo={post}/>
                    })}
                </div>
                <button className="create" onClick={()=>{setToggleState(true)}}>
                    <span>+</span>
                    <span>Create Post</span>
                </button>
            </div>
            {toggleState && (
                <form className="post-form" onSubmit={AddPost}>
                    <label htmlFor="post-title">Title</label>
                    <input 
                        id="post-title" 
                        name="title" 
                        type="text" 
                        placeholder='Enter a title'/>
                    <label htmlFor="post-caption">Caption</label>
                    <input 
                        id="post-caption" 
                        name="caption" 
                        type="text" 
                        placeholder='Enter a caption'/>
                    <label htmlFor="post-image">Image (optional)</label>
                    <input 
                        id="post-image" 
                        name="image" 
                        type="file"
                        accept="image/png, image/jpg, image/jpeg"/>
                    <button type="reset" onClick={()=>{setToggleState(false)}}>Discard</button>
                    <button type="submit">Post</button>
                </form>
            )}
        </div>
    )
}