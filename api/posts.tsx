import { BASE_URL, ACCESS_KEY } from '../constants/globals'
import { PostProps } from '../constants/types'

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