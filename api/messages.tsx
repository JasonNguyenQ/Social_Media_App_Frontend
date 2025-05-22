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

export async function addMessage(variables : { threadId: string, message: string}): Promise<number>{
    try{
        const { threadId } = variables

        if (threadId === "") return Promise.resolve(-1)

        const token = sessionStorage.getItem(ACCESS_KEY)

        const response = await fetch(`${BASE_URL}/api/messages`, {
            method: 'POST',
            credentials: "include",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(variables)
        })
        const messageId = response.json()
        return Promise.resolve(messageId)
    }
    catch(err){
        console.log(err)
        return Promise.resolve(-1)
    }
}

export async function deleteMessage(messageId: number): Promise<string>{
    try{
        const token = sessionStorage.getItem(ACCESS_KEY)

        await fetch(`${BASE_URL}/api/messages/${messageId}`, {
            method: 'DELETE',
            credentials: "include",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({messageId})
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
        if(threadId == "" || threadId === undefined) return Promise.resolve([])
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
            messageId: number,
        }

        
        const messages: message[] = await response.json()
        const returned = messages.map((message)=>({
            messageId: message.messageId,
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