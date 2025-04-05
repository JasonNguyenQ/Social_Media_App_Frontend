import "./Navbar.css";
import { Link } from "react-router-dom";
import { useDebounce } from "../../hooks/useDebounce";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Search_Icon from "/search_icon.svg"
import Explore_Icon from "/explore_icon.svg"
import Person_Icon from "/person_icon.svg"
import Message_Icon from "/message_icon.svg"
import Settings_Icon from "/settings_icon.svg"

type returnedUser = {
	id: number;
	username: string;
};

export default function Navbar() {
	const [focused, setFocused] = useState<boolean>(false);
	const [search, setSearch] = useDebounce<string>("", 150);
	const [matchedUsers, setMatchedUsers] = useState<returnedUser[]>([]);
	const container = useRef<HTMLDivElement>(null);

	function handleFocus(e: MouseEvent) {
		const element = e.target as HTMLElement;
		setFocused(element.closest(".search-container") !== null);
	}

	useEffect(() => {
		document.body.addEventListener("click", handleFocus);

		return () => {
			document.body.removeEventListener("click", handleFocus);
		};
	}, []);

	useEffect(() => {
		async function FindUser() {
			if (search === "") {
				setMatchedUsers([]);
				return;
			}

			const response = await fetch(
				`http://localhost:3000/api/users/search/?username=${search}`
			);
			const users = await response.json();
			setMatchedUsers(users);
		}
		FindUser();
	}, [search]);

	async function FindUser(e: ChangeEvent<HTMLInputElement>) {
		setSearch(e.target.value);
	}

	return (
		<nav id={"navbar"}>
			<div className="search-container" ref={container}>
				<img src={Search_Icon} alt="search icon" className="search-icon"/>
				<input
					name="search"
					className="search-bar"
					type="search"
					placeholder="Search for people..."
					autoComplete="off"
					onChange={FindUser}
					onFocus={() => setFocused(true)}
				></input>
				<div className="search-results">
					<span>Results</span>
					<ul>
						{matchedUsers.length !== 0 &&
							focused &&
							matchedUsers.map((user, index) => {
								return (
									<li key={index}>
										<Link to={`/search/${user.id}`}>
											<img src={Person_Icon} alt="user icon"/>
											{user.username}
										</Link>
									</li>
								);
							})}
					</ul>
				</div>
			</div>

			<ul className="links">
				<li>
					<Link to="/explore"><img src={Explore_Icon} alt="explore icon"/><span>Explore</span></Link>
				</li>
				<li>
					<Link to="/profile"><img src={Person_Icon} alt="profile icon"/><span>Profile</span></Link>
				</li>
				<li>
					<Link to="/messages"><img src={Message_Icon} alt="message icon"/><span>Messages</span></Link>
				</li>
				<li>
					<Link to="/settings"><img src={Settings_Icon} alt="settings icon"/><span>Settings</span></Link>
				</li>
			</ul>
		</nav>
	);
}
