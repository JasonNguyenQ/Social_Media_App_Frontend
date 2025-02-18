import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ProfileProps } from '../../constants/types'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import './Search.css'
import fetchUser from '../../api/fetchUser'
import Navbar from '../Navbar/Navbar'
import { APP_NAME } from '../../constants/globals'
import { acceptFriend, addFriend, getFriendStatus, removeFriend } from '../../api/friends'

export default function Search(){
    const { userid } = useParams()
    const queryClient = useQueryClient();

    const { data: userInfo, isLoading } = useQuery<ProfileProps>({
        queryKey: ["userInfo", {userid}],
        queryFn: ()=>fetchUser(Number(userid)),
        initialData: {
            username : "",
            firstName: "",
            lastName: ""
        }
    })
    
    const { data: state } = useQuery({
        queryKey: ["friendStatus", {userid}],
        queryFn: ()=>getFriendStatus(Number(userid)),
        initialData: {
            state: ""
        }
    })

    const Invalidate = ()=>{
        queryClient.invalidateQueries({
            queryKey: ["friendStatus"]
        })
    }

    const { mutate: sendRequest } = useMutation({
        mutationFn: async () => await addFriend(Number(userid)),
        onSuccess: Invalidate
    })

    const { mutate: rejectRequest } = useMutation({
        mutationFn: async () => await removeFriend(Number(userid)),
        onSuccess: Invalidate
    })
    
    const { mutate: acceptRequest } = useMutation({
        mutationFn: async () => await acceptFriend(Number(userid)),
        onSuccess: Invalidate
    })

    type states = {
        [key: string] : {fn: Function, label: string}
    }
    const status: states = Object.freeze({
        "Strangers": {fn: sendRequest, label: "Add Friend"},
        "Awaiting": {fn: acceptRequest, label: "Accept Friend Request"},
        "Friends":{fn: rejectRequest, label: "Remove Friend"},
        "Pending": {fn: rejectRequest, label: "Withdraw Request"},
        "You": {fn: ()=>{}, label: "You"}
    })

    if(isLoading){
        return <div>LOADING</div>
    }
    return (
        <>
            <Helmet>
                <title>"{userInfo.username}" | {APP_NAME}</title>
                <meta name='description' content='User Profile Page' />
            </Helmet>
            <Navbar/>
            <div className="profile-container" style={{
                minHeight: '100svh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'hsl(0,0%,90%)',
                backgroundImage: `url${userInfo.backgroundImage}`
            }}>
                <div className="user-profile">
                    <div>{userInfo.username}</div>
                    <div>{userInfo.firstName}</div>
                    <div>{userInfo.lastName}</div>
                    <button onClick={() => status[state]?.fn()}>{status[state]?.label}</button>
                </div>
            </div>
        </>
    );
}