import { Helmet } from "react-helmet-async";
import { APP_NAME } from "../../constants/globals";
import { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import InputField from "./Fields";
import "./SignUp.css";

export default function SignUp() {
	const navigate = useNavigate();

	async function Register(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		const username = formData.get("username");
		const password = formData.get("password");
		const confirmPassword = formData.get("confirmation");
		const firstName = formData.get("firstName");
		const lastName = formData.get("lastName");

		if (password !== confirmPassword) return;

		await fetch("http://localhost:3000/api/users/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username: username,
				password: password,
				firstName: firstName,
				lastName: lastName,
			}),
		});
		navigate("/login");
	}

	return (
		<div id={"signup-page"}>
			<Helmet>
				<title>Register | {APP_NAME}</title>
				<meta name="description" content="Sign Up to Use More Features" />
			</Helmet>
			<form onSubmit={Register} className="form">
				<h2>Create Account</h2>
				<fieldset>
					<legend>Personal Information</legend>
					<InputField
						name="firstName"
						type="text"
						label="First Name"
						placeholder="e.g. John"
						autocomplete="first-name"
						required
					/>
					<InputField
						name="lastName"
						type="text"
						label="Last Name"
						placeholder="e.g. Doe"
						autocomplete="family-name"
						required
					/>
				</fieldset>

				<fieldset>
					<legend>Account Information</legend>
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
						autocomplete="new-password"
						required
					/>
					<InputField
						name="confirmation"
						type="password"
						label="Confirm Password"
						autocomplete="new-password"
						placeholder="Verify your password"
						required
					/>
				</fieldset>
				<p>
					Note: All information except password <strong>WILL</strong> be public
				</p>
				<button type="submit">Sign Up</button>
				<div className="form-footer">
					<div className="redirect-form">
						<span>Already have an account?</span>
						<Link to="/login">Login</Link>
					</div>
				</div>
			</form>
		</div>
	);
}
