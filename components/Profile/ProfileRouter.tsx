import { useParams } from "react-router-dom"
import { useQuery } from '@tanstack/react-query'
import { ProfileProps } from '../../constants/types'
import { APP_NAME } from '../../constants/globals'
import { Helmet } from 'react-helmet-async'
import fetchUser from '../../api/users'
import PersonalProfile from "./PersonalProfile.tsx";
import Profile from "./Profile.tsx";
import Navbar from "../Navbar/Navbar.tsx"

export default function ProfileRouter(){
    const { userid } = useParams()
    
    if (userid) {
        const { data: userInfo, isLoading } = useQuery<ProfileProps>({
            queryKey: ["userInfo", {userid}],
            queryFn: ()=>fetchUser(Number(userid)),
            initialData: {
                username : "",
                firstName: "",
                lastName: ""
            }
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
                <Profile userInfo={userInfo} isSelf={false}/>
            </>
        );
    }
    else{
        return (
            <PersonalProfile/>
        );
    }
}