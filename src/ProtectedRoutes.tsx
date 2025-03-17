import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Authorize from '../api/Auth'
import { ACCESS_KEY } from '../constants/globals'

const VALIDATION_TIME = 60*60*1000

export default function ProtectedRoutes(){
    const location = useLocation()
    const token = sessionStorage.getItem(ACCESS_KEY)
    
    const {data: userInfo, isLoading} = useQuery({
        queryKey: ["auth", {token}],
        queryFn: async () => await Authorize(token),
        refetchInterval: VALIDATION_TIME
    })

    if(isLoading){
        return <div>LOADING</div>
    }

    return userInfo?.id !== -1 ? <Outlet/> : <Navigate to="/login" state={{ from : location }}/>
}