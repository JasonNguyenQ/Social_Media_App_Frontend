import { useContext } from 'react'
import { UserContext } from './Profile';

export default function ProfileHero(){
    const { 
        firstName,
        lastName, 
        backgroundImage, 
        profilePicture, 
        followers = 0, 
        following = 0,
    } = useContext(UserContext)
    return (
        <>
            <div className="profile-container">
                <img src={backgroundImage} alt="" className="bg-image"/>
                <img src={profilePicture} alt="" className="pfp"/>
                <div className="profile-information">
                    <span className="large name">{firstName} {lastName}</span>
                    <span className="followers">Followers: {followers}</span>
                    <span className="following">Following: {following}</span>
                </div>
            </div>
        </>
    );
}