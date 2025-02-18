import { Helmet } from 'react-helmet-async'
import { createContext } from 'react'
import './Profile.css'
import ProfileHero from './ProfileHero'
import { APP_NAME } from '../../constants/globals'
import { ProfileProps } from '../../constants/types'
import { useQuery } from '@tanstack/react-query'
import Authorize from '../../api/Auth'
import { ACCESS_KEY } from '../../constants/globals'
import fetchUser from '../../api/fetchUser'
import Navbar from '../Navbar/Navbar'
import { UserIdentifier } from '../../constants/types'

export const UserContext = createContext<ProfileProps>({
    username: "",
    firstName: "",
    lastName: ""
})

export default function Profile(){
    const token = sessionStorage.getItem(ACCESS_KEY)

    const {data: userIdentifier} = useQuery<UserIdentifier>({
        queryKey: ["auth", {token}],
        queryFn: async ()=> await Authorize(token)
    })

    const id = userIdentifier?.id || -1
    
    const { data: userInfo } = useQuery<ProfileProps>({
        queryKey: ["userInfo", {id}],
        queryFn: async ()=> await fetchUser(id),
        initialData: {
            username : "",
            firstName: "",
            lastName: "",
            description: "no description"
        }
    })

    return (
        <>
            <Helmet>
                <title>Profile | {APP_NAME}</title>
                <meta name='description' content='User Profile Page' />
            </Helmet>
            <Navbar/>
            <UserContext.Provider value={userInfo}>
                <ProfileHero/>
            </UserContext.Provider>
            <p className="about">{userInfo.description}</p>
        </>
    )
}