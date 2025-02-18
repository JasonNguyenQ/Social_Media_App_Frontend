import { Helmet } from 'react-helmet-async';
import { APP_NAME } from '../../constants/globals'
import { useLocation, useNavigate, Link } from 'react-router-dom';
import InputField from './Fields';
import './SignUp.css'
import { FormEvent } from 'react';

export default function Login(){
    const location = useLocation()
    const navigate = useNavigate()
    const path = location.state?.from?.pathname || '/profile'
    
    async function Validate(e: FormEvent<HTMLFormElement>){
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        const username = formData.get("username")
        const password = formData.get("password")
        fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({username: username, password: password})
        })
        .then((res)=>{
            if(res.ok){
                return res.json()
            }
            throw new Error("UNAUTHORIZED")
        })
        .then((data)=>{
            sessionStorage.setItem('access_token', data["access_token"])
            navigate(path)
        })
        .catch((err)=>{
            console.log(err)
        })

    }

    return (
        <>
            <Helmet>
                <title>Login | {APP_NAME}</title>
                <meta name='description' content='Log into Your Account' />
            </Helmet>
            <form onSubmit={Validate} className="form">
                <h2>Login</h2>
                <fieldset>
                    <legend>Account Information</legend>
                    <InputField 
                        name="username" 
                        type="text" 
                        label="Username" 
                        placeholder="e.g. ChubbyRabbit029" 
                        autocomplete="username" 
                        required/>
                    <InputField 
                        name="password" 
                        type="password" 
                        label="Password" 
                        placeholder="Enter your password" 
                        autocomplete="current-password" 
                        required/>
                </fieldset>
                <button type='submit'>Log In</button>
                <div className="form-footer">
                    <div className="redirect-form">
                        <span>Don't have an account?</span>
                        <Link to='/register'>Sign Up</Link>
                    </div>
                    <Link to='/'>Forgot Password?</Link>
                </div>
            </form>
        </>
    );
}