import { ProfileProps } from "../constants/types"
import { BASE_URL, ACCESS_KEY } from '../constants/globals' 

export default async function fetchUser(id: number | undefined): Promise<ProfileProps>{
    const rej = {
        username : "",
        firstName: "",
        lastName: "",
        description: "",
        profilePicture: undefined,
        backgroundImage: undefined
    }
    
    try{
        if(id === undefined) Promise.resolve(rej)
        const user = await fetch(`${BASE_URL}/api/users/?id=${id}`)
        const { username, firstName, lastName, description, profilePicture, backgroundImage } = await user.json()
        return Promise.resolve({
            username : username,
            firstName: firstName,
            lastName: lastName,
            description: description,
            profilePicture: profilePicture,
            backgroundImage: backgroundImage
        })
    }
    catch(err){
        return Promise.resolve(rej)
    }
}

export async function updateProfile(form : FormData): Promise<string>{
    try{
        const token = sessionStorage.getItem(ACCESS_KEY)

        await fetch(`${BASE_URL}/api/users`, {
            method: 'PATCH',
            credentials: "include",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            body: form
        })
        return Promise.resolve("Finished")
    }
    catch(err){
        console.log(err)
        return Promise.resolve("Incomplete")
    }
}