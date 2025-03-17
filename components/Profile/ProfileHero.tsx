import { useContext, useRef } from 'react'
import { UserContext } from './Profile';
import { useToggle } from '../../hooks/useToggle'
import { PencilSquare } from 'react-bootstrap-icons';

export default function ProfileHero(){
    const [ state, Toggle ] = useToggle(false)
    const editor = useRef<HTMLDialogElement>(null)

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
                <PencilSquare className="profile-edit" size={20} onClick={Toggle}></PencilSquare>
            </div>
            <dialog ref={editor} open={state}>
                <form>
                    <label htmlFor="profile-picture">Profile Picture</label>
                    <input type="file" id="profile-picture" accept="image/*" style={{display: "none"}}/>
                    <br/>
                    <label htmlFor="profile-background">Background Image</label>
                    <input type="file" id="profile-background" accept="image/*" style={{display: "none"}}/>
                    <br/>
                    <label htmlFor="profile-description">Description</label>
                    <textarea id="profile-description" style={{resize: "none"}}></textarea>
                </form>
            </dialog>
        </>
    );
}