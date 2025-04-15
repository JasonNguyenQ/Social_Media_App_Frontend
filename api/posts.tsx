import { BASE_URL, ACCESS_KEY } from '../constants/globals' 

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