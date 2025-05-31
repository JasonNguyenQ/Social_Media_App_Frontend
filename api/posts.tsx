import { BASE_URL, ACCESS_KEY } from '../constants/globals'
import { CommentProps, PostProps } from '../constants/types'

export async function GetPosts(): Promise<PostProps[]>{
    try{
        const response = await fetch(`${BASE_URL}/api/posts`, {
            method: 'GET',
            credentials: "include",
        })
        const posts = await response.json()
        return Promise.resolve(posts)
    }
    catch(err){
        console.log(err)
        return Promise.resolve([])
    }
}

export async function DeletePost(id: number): Promise<string>{
    try{
        const token = sessionStorage.getItem(ACCESS_KEY)

        await fetch(`${BASE_URL}/api/posts/${id}`, {
            method: 'DELETE',
            credentials: "include",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })

        return Promise.resolve("SUCCESS")
    }
    catch(err){
        console.log(err)
        return Promise.resolve("INCOMPLETE")
    }
}

export async function CreatePost(form : FormData): Promise<string>{
    try{
        const token = sessionStorage.getItem(ACCESS_KEY)

        await fetch(`${BASE_URL}/api/posts`, {
            method: 'POST',
            credentials: "include",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            body: form
        })
        return Promise.resolve("POSTED")
    }
    catch(err){
        console.log(err)
        return Promise.resolve("ERROR POSTING")
    }
}

export async function GetComments(postId: number): Promise<CommentProps[]>{
    try{
        const response = await fetch(`${BASE_URL}/api/posts/comments/${postId}`, {
            method: 'GET',
            credentials: "include",
        })
        const comments = await response.json()
        return Promise.resolve(comments)
    }
    catch(err){
        console.log(err)
        return Promise.resolve([])
    }
}

export async function CountComments(id: number): Promise<number>{
    try{
        const token = sessionStorage.getItem(ACCESS_KEY)

        const response = await fetch(`${BASE_URL}/api/posts/comments/count/${id}`,
            {
            method: 'GET',
            credentials: "include",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        const count = await response.json()

        return Promise.resolve(Number(count))
    }
    catch(err){
        console.log(err)
        return Promise.resolve(0)
    }
}

export async function CreateComment(variables : { postId: number, comment: string}): Promise<string>{
    try{
        const token = sessionStorage.getItem(ACCESS_KEY)

        await fetch(`${BASE_URL}/api/posts/comments`, {
            method: 'POST',
            credentials: "include",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(variables)
        })
        return Promise.resolve("COMMENTED")
    }
    catch(err){
        console.log(err)
        return Promise.resolve("ERROR COMMENTING")
    }
}