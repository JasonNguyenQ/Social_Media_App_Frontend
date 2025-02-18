export type ProfileProps = {
    username: string,
    backgroundImage?: string,
    profilePicture?: string,
    firstName: string,
    lastName: string,
    followers?: number,
    following?: number,
    description?: string
  }

export type MessageInfo = {
  from: string,
  message: string,
  timeStamp: number
}

export type ThreadInfo = {
  threadId: string,
  threadName: string
}

export type UserIdentifier = {
  id: number, 
  username: string
}