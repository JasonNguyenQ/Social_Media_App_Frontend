import { BASE_URL, ACCESS_KEY } from '../constants/globals' 

export async function GetReaction(variables : { type: string, id: number }): Promise<string[]>{
    try{
        const token = sessionStorage.getItem(ACCESS_KEY)

        const response = await fetch(`${BASE_URL}/api/reactions?type=${variables.type}&id=${variables.id}`,
            {
            method: 'GET',
            credentials: "include",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        const reactions = await response.json()
        console.log(reactions)
        return Promise.resolve(reactions)
    }
    catch(err){
        console.log(err)
        return Promise.resolve([])
    }
}

export async function CreateReaction(variables : { type: string, id: number, reaction: string}): Promise<string>{
    try{
        const token = sessionStorage.getItem(ACCESS_KEY)

        await fetch(`${BASE_URL}/api/reactions`, {
            method: 'POST',
            credentials: "include",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(variables)
        })
        return Promise.resolve("REACTED")
    }
    catch(err){
        console.log(err)
        return Promise.resolve("ERROR REACTING")
    }
}

export async function DeleteReaction(variables : { type: string, id: number, reaction: string}): Promise<string>{
    try{
        const token = sessionStorage.getItem(ACCESS_KEY)

        await fetch(`${BASE_URL}/api/reactions`, {
            method: 'DELETE',
            credentials: "include",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(variables)
        })
        return Promise.resolve("DELETED REACTION")
    }
    catch(err){
        console.log(err)
        return Promise.resolve("ERROR DELETING REACTION")
    }
}