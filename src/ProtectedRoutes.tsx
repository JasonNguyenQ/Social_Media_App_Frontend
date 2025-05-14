import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Authorize from '../api/Auth'
import { BASE_URL, ACCESS_KEY, AUTH_VALIDATION_TIME } from '../constants/globals'
import { UserIdentifier } from '../constants/types'
import { io, Socket } from "socket.io-client";

export default function ProtectedRoutes(){
    const location = useLocation()
    const token = sessionStorage.getItem(ACCESS_KEY)
    
    const {data: userInfo, isLoading} = useQuery<UserIdentifier>({
        queryKey: ["auth", {token}],
        queryFn: async () => await Authorize(token),
        refetchInterval: AUTH_VALIDATION_TIME,
        staleTime: AUTH_VALIDATION_TIME,
    })
    
    useQuery<Socket>({
        queryKey: ["socket", {token}],
        queryFn: ()=>io(BASE_URL, {query: `token=${token}` as any}),
        staleTime: Infinity
    })
    
    if(isLoading){
        return <div>LOADING</div>
    }

    return userInfo?.id !== -1 ? <Outlet/> : <Navigate to="/login" state={{ from : location }}/>
}