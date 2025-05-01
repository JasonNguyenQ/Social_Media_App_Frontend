import { BASE_URL, ACCESS_KEY } from '../constants/globals' 
import { ThreadInfo, MessageInfo } from '../constants/types'

export async function getThreads(): Promise<ThreadInfo[]>{
    try{
        const token = sessionStorage.getItem(ACCESS_KEY)
        const response = await fetch(`${BASE_URL}/api/messages/threads`, {
            method: 'GET',
            credentials: "include",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        const threads = await response.json()
        return Promise.resolve(threads)
    }
    catch(err){
        console.log(err)
        return Promise.resolve([])
    }
}

export async function addMessage(variables : { threadId: string, message: string}): Promise<string>{
    try{
        const { threadId } = variables

        if (threadId === "") return Promise.resolve("Incomplete")

        const token = sessionStorage.getItem(ACCESS_KEY)

        await fetch(`${BASE_URL}/api/messages`, {
            method: 'POST',
            credentials: "include",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(variables)
        })
        return Promise.resolve("Finished")
    }
    catch(err){
        console.log(err)
        return Promise.resolve("Incomplete")
    }
}

export async function getMessages(threadId: string | undefined): Promise<MessageInfo[]>{
    try{
        const token = sessionStorage.getItem(ACCESS_KEY)
        const response = await fetch(`${BASE_URL}/api/messages/${threadId}`, {
            method: 'GET',
            credentials: "include",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        type message = {
            username: string,
            message: string
            createdAt: Date,
        }

        
        const messages: message[] = await response.json()
        const returned = messages.map((message)=>({
            from: message.username, 
            message: message.message, 
            timeStamp: Date.parse(message.createdAt.toString())
        }))

        return Promise.resolve(returned)
    }
    catch(err){
        console.log(err)
        return Promise.resolve([])
    }

}