import { Helmet } from "react-helmet-async";
import { APP_NAME } from "../../constants/globals";
import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import InputField from "./Fields";
import { z } from "zod"
import "./SignUp.css";

const userInputSchema = z.object({
	username: z.
		string()
		.refine(data=>!data.includes(" "), { message: "Username must NOT include spaces"}),

	password: z
		.string()
		.min(8, { message: "Password MUST have 8 characters or more" })
		.regex(/[A-Z]/, { message: "Password MUST include at least one capital letter"})
		.regex(/[0-9]/, { message: "Password MUST include at least one digit"})
		.regex(/[^a-zA-Z0-9]/, { message: "Password MUST include at least one special character"}),

	confirmation: z
		.string(),

	firstName: z
		.string()
		.regex(/^[A-Z][a-z]*$/, { message: "First name MUST start with an uppercase and trail with lowercase English letters" }),

	lastName: z
		.string()
		.regex(/^[A-Z][a-z]*$/, { message: "Last name MUST start with an uppercase and trail with lowercase English letters" }),

	
}).refine((data)=> 
	data.password === data.confirmation, 
	{ 
		message: "Passwords do NOT match", 
		path: ["confirmation"]
	}
)

export default function SignUp() {
	const [issueMessages, setIssueMessages] = useState<Record<string,Array<string>>>({})
	const navigate = useNavigate();

	async function Register(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		const dataEntries = {
			username: formData.get("username"),
			password: formData.get("password"),
			firstName: formData.get("firstName"),
			lastName: formData.get("lastName")
		}

		const result = userInputSchema.safeParse({...dataEntries, confirmation: formData.get("confirmation")});
		if(result.success){
			await fetch("http://localhost:3000/api/users/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(dataEntries),
			});
			navigate("/login");
		}
		else{
			setIssueMessages(
				result.error.issues.reduce((map: Record<string,Array<string>>, issue) => {
					const key = issue.path[0]
					if (!(key in map)) {
					map[key] = [];
					}
					map[key].push(issue.message)
					return map;
				}, {})
			)
		}
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
						issues={issueMessages["firstName"]}
					/>
					<InputField
						name="lastName"
						type="text"
						label="Last Name"
						placeholder="e.g. Doe"
						autocomplete="family-name"
						required
						issues={issueMessages["lastName"]}
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
						issues={issueMessages["username"]}
					/>
					<InputField
						name="password"
						type="password"
						label="Password"
						placeholder="Enter your password"
						autocomplete="new-password"
						required
						issues={issueMessages["password"]}
					/>
					<InputField
						name="confirmation"
						type="password"
						label="Confirm Password"
						autocomplete="new-password"
						placeholder="Verify your password"
						required
						issues={issueMessages["confirmation"]}
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
