import { BASE_URL } from "../constants/globals"
import { UserIdentifier } from "../constants/types"
export default async function Authorize(token: string | null) : Promise<UserIdentifier>{
    try{
        const response = await fetch(`${BASE_URL}/auth/authenticate`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        const data: UserIdentifier = await response.json()
        if (data.id) return Promise.resolve(data)
        return Promise.resolve({id: -1, username: ""})
    }
    catch(err){
        return Promise.resolve({id: -1, username: ""})
    }
}