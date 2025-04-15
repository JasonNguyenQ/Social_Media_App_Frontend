import { FormEvent, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../../api/users";
import { FileBlobToURL } from "../../utilities/URL"
import { ProfileProps } from "../../constants/types";
import Edit_Icon from "/edit_icon.svg"
import StatusBar from "./StatusBar.tsx"

export default function Profile({userInfo, isSelf} : {userInfo : ProfileProps, isSelf : boolean}) {
	const {
		id,
		firstName,
		lastName,
		profilePicture,
		backgroundImage,
		followers = 0,
		following = 0,
		description
	} = userInfo;

	const [text, setText] = useState("");
	const queryClient = useQueryClient();

	const profilePictureURL = FileBlobToURL(profilePicture);
	const backgroundImageURL = FileBlobToURL(backgroundImage);

	const [toggleState, setToggleState] = useState(false);

	async function ApplyChanges(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const desc = formData.get("description") as string;
		const pfp = formData.get("profile-picture") as File;
		const profileBackground = formData.get("profile-background") as File;
		const data = new FormData();

		if (desc) {
			data.append("description", desc)
		}

		if (pfp.type.startsWith("image")) {
			data.append("profilePicture", pfp);
		}

		if (profileBackground.type.startsWith("image")) {
			data.append("backgroundImage", profileBackground);
		}
		await updateProfile(data);
		queryClient.invalidateQueries({ queryKey: ["userInfo", { id }] })
		setToggleState(false);
	}
	
	return (
		<div id="profile-page">
			<div className="profile-container">
				<img src={backgroundImageURL} alt="" className="bg-image"/>
				<img src={profilePictureURL} alt="" className="pfp"/>
				<div className="profile-information">
					<span className="large name">
						{firstName} {lastName}
					</span>
					<span className="followers">Followers: {followers}</span>
					<span className="following">Following: {following}</span>
					{!isSelf && <StatusBar/>}
				</div>
				{isSelf && 
				<img
					src={Edit_Icon}
					alt="edit icon"
					className="profile-edit"
					onClick={()=>{
						setToggleState(true); 
						setText(description || "");
					}}
				/>
				}
			</div>
			{toggleState && isSelf && (
				<dialog className="profile-modal">
					<form onSubmit={ApplyChanges}>
						<label htmlFor="profile-description">
							Description
							<textarea
								name="description"
								id="profile-description"
								style={{ resize: "none" }}
								onChange={(e)=>{setText(e.currentTarget.value)}}
								defaultValue={description}
							></textarea>
						</label>
						<p>{text.length}/2000</p>
						<div className="profile-actions">
							<label htmlFor="profile-picture" className="profile-file">
								Change Profile Picture
								<input
									name="profile-picture"
									type="file"
									id="profile-picture"
									accept="image/png, image/jpg, image/jpeg"
									style={{ display: "none" }}
								/>
							</label>
							<label htmlFor="profile-background" className="profile-file">
								Change Background Image
								<input
									name="profile-background"
									type="file"
									id="profile-background"
									accept="image/png, image/jpg, image/jpeg"
									style={{ display: "none" }}
								/>
							</label>
							<button type="reset" onClick={()=>{setToggleState(false)}}>
								Discard Changes
							</button>
							<button type="submit">Apply Changes</button>
						</div>
					</form>
				</dialog>
			)}
			<p className="about">{userInfo.description}</p>
		</div>
	);
}
