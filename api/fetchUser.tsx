import { ProfileProps } from "../constants/types"
import { BASE_URL } from "../constants/globals"

export default async function fetchUser(id: number | undefined): Promise<ProfileProps>{
    const rej = {
        username : "",
        firstName: "",
        lastName: "",
        description: "",
        profilePicture: "",
        backgroundImage: ""
    }
    
    try{
        if(id === undefined) Promise.reject(rej)
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