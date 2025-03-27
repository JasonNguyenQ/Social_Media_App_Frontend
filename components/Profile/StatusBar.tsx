import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import './Profile.css'
import { acceptFriend, addFriend, getFriendStatus, removeFriend } from '../../api/friends'
import { useParams } from 'react-router-dom';

export default function StatusBar(){
    const  { userid } = useParams();
    const queryClient = useQueryClient();
    
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
        "You": {fn: ()=>{}, label: "You"},
        "Unknown": {fn: ()=>{}, label: "Unknown"}
    })

    return (
        <div hidden={status[state]?.label === "You" || status[state]?.label === "Unknown"}>
            <button className="friend-status" onClick={() => status[state]?.fn()}>{status[state]?.label}</button>
        </div>
    );
}