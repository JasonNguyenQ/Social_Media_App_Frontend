import { Helmet } from "react-helmet-async";
import { APP_NAME } from "../../constants/globals";
import { useLocation, useNavigate, Link } from "react-router-dom";
import InputField from "./Fields";
import "./SignUp.css";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import AppInfo from "./AppInfo"

export default function Login() {
	const location = useLocation();
	const navigate = useNavigate();
	const path = location.state?.from?.pathname || "/profile";
	const queryClient = useQueryClient();

	const buttonElement = useRef<HTMLButtonElement>(null);
	const [successfulLogin, setSuccessfulLogin] = useState(true);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(()=>{
		if (!buttonElement.current) return
		
		if(isLoading) buttonElement.current.classList.add('loading');
		else buttonElement.current.classList.remove('loading');
	},[isLoading])

	async function Validate(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setIsLoading(true);
		const formData = new FormData(e.currentTarget);

		const username = formData.get("username");
		const password = formData.get("password");
		fetch("http://localhost:3000/auth/login", {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ username: username, password: password }),
		})
			.then((res) => {
				if (res.ok) {
					return res.json();
				}
				throw new Error("UNAUTHORIZED");
			})
			.then((data) => {
				queryClient.invalidateQueries({
					queryKey: ["postReactions"],
				})
				queryClient.invalidateQueries({
					queryKey: ["threads"],
				})
				queryClient.invalidateQueries({
					queryKey: ["messages"],
				})
				queryClient.invalidateQueries({
					queryKey: ["friendStatus"],
				})
				sessionStorage.removeItem("activeThread")
				sessionStorage.setItem("access_token", data["access_token"]);
				setIsLoading(false);
				navigate(path);
			})
			.catch(() => {
				setSuccessfulLogin(false)
				setIsLoading(false);
			});
	}

	return (
		<div id={"login-page"}>
			<Helmet>
				<title>Login | {APP_NAME}</title>
				<meta name="description" content="Log into Your Account" />
			</Helmet>
			<div className="form-wrapper">
				<AppInfo/>
				<form onSubmit={Validate} className="form">
					<h2>Log Into Your Account</h2>
					<p>Login to be able to create posts, chat privately, and more.</p>
					{
						!successfulLogin && 
						!isLoading &&
						<span style={{
							color: "red", 
							fontSize: "small", 
							fontWeight: "500"}}>
								Incorrect username or password
						</span>
					}
					<InputField
						name="username"
						type="text"
						label="Username"
						placeholder="e.g. ChubbyRabbit029"
						autocomplete="username"
						required
					/>
					<InputField
						name="password"
						type="password"
						label="Password"
						placeholder="Enter your password"
						autocomplete="current-password"
						required
					/>
					<button type="submit" ref={buttonElement}>{isLoading ? "Authenticating..." : "Log In"}</button>
					<div className="form-footer">
						<div className="redirect-form">
							<span>Don't have an account?</span>
							<Link to="/register">Sign Up</Link>
						</div>
						<Link to="/">Forgot Password?</Link>
					</div>
				</form>
			</div>
		</div>
	);
}
