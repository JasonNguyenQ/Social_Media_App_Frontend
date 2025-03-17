import { BASE_URL, ACCESS_KEY } from '../constants/globals' 

export async function getFriendStatus(userid: number){
    try{
        const token = sessionStorage.getItem(ACCESS_KEY)
        const response = await fetch(`${BASE_URL}/api/friends/${userid}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
        const status = await response.json()
        return status.state || "Unknown"
    }
    catch(err){
        return "Unknown"
    }
}

export async function addFriend(userid: number){
    try{
        const token = sessionStorage.getItem(ACCESS_KEY)
        await fetch(`${BASE_URL}/api/friends/`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({id: userid})
        })
    }
    catch(err){
        console.log(err)
    }
}

export async function acceptFriend(userid: number){
    try{
        const token = sessionStorage.getItem(ACCESS_KEY)
        await fetch(`${BASE_URL}/api/friends/${userid}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
    }
    catch(err){
        console.log(err)
    }
}

export async function removeFriend(userid: number){
    try{
        const token = sessionStorage.getItem(ACCESS_KEY)
        await fetch(`${BASE_URL}/api/friends/${userid}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
    }
    catch(err){
        console.log(err)
    }
}