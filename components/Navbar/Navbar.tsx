import "./Navbar.css"
import { Link } from "react-router-dom";
import { useDebounce } from "../../hooks/useDebounce"
import { ChangeEvent, useEffect, useRef, useState } from "react";

type returnedUser = {
    id: number,
    username: string,
}

export default function Navbar(){
    const [ focused, setFocused ] = useState<boolean>(false)
    const [ search, setSearch ] = useDebounce<string>("", 150)
    const [ matchedUsers, setMatchedUsers ] = useState<returnedUser[]>([]);
    const container = useRef<HTMLDivElement>(null)

    function handleFocus(e: MouseEvent) {
        const element = e.target as HTMLElement
        setFocused(element.closest(".search-container") !== null)
    }

    useEffect(()=>{
        document.body.addEventListener("click", handleFocus)

        return ()=>{
            document.body.removeEventListener("click", handleFocus)
        }
    },[])

    useEffect(()=>{
        async function FindUser(){
            if (search === ""){
                setMatchedUsers([])
                return
            }

            const response = await fetch(`http://localhost:3000/api/users/search/?username=${search}`)
            const users = await response.json()
            setMatchedUsers(users)
        }
        FindUser()
    },[search])

    async function FindUser(e: ChangeEvent<HTMLInputElement>){
        setSearch(e.target.value)
    }
    
    return (
        <>
            <nav>
                <div className="search-container" ref={container}>
                    <input 
                        name="search" 
                        className="search-bar" 
                        type="search" 
                        placeholder="Search for people..." 
                        autoComplete="off"
                        onChange={FindUser}
                        onFocus={()=>setFocused(true)}>
                    </input>
                    <ul className="search-results">
                        {matchedUsers.length !== 0 && focused && matchedUsers.map((user, index)=>{
                            return (
                                <li key={index}><Link to={`/search/${user.id}`}>{user.username}</Link></li>
                            )
                        })}
                    </ul>
                </div>
                
                <ul className="links">
                    <li><Link to="/explore">Explore</Link></li>
                    <li><Link to="/profile">Profile</Link></li>
                    <li><Link to="/messages">Messages</Link></li>
                    <li><Link to="/settings">Settings</Link></li>
                </ul>

            </nav>
        </>
    );
}