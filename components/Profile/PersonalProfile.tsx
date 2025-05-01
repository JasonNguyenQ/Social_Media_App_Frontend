import { Helmet } from "react-helmet-async";
import "./Profile.css";
import Profile from "./Profile";
import { APP_NAME } from "../../constants/globals";
import { ProfileProps } from "../../constants/types";
import { useQuery } from "@tanstack/react-query";
import { ACCESS_KEY } from "../../constants/globals";
import fetchUser from "../../api/users";
import Navbar from "../Navbar/Navbar";
import { UserIdentifier } from "../../constants/types";
import { useQueryClient } from "@tanstack/react-query";

const defaultUser : ProfileProps = {
	username: "Loading...",
	firstName: "Loading",
	lastName: "User..."
}

export default function PersonalProfile() {
	const token = sessionStorage.getItem(ACCESS_KEY);

	const queryClient = useQueryClient()
	const userIdentifier : UserIdentifier | undefined = queryClient.getQueryData(["auth", { token }])

	const id = userIdentifier?.id || -1;

	const { data: userInfo } = useQuery<ProfileProps>({
		queryKey: ["userInfo", { id }],
		queryFn: async () => await fetchUser(id),
	});

	return (
		<div>
			<Helmet>
				<title>Profile | {APP_NAME}</title>
				<meta name="description" content="User Profile Page" />
			</Helmet>
			<Navbar />
			<Profile userInfo={{...(userInfo || defaultUser), id:id}} isSelf={true}/>
		</div>
	);
}
