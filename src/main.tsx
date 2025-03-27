import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "./index.css";
import ProtectedRoutes from "./ProtectedRoutes.tsx";
import Messages from "../components/Messages/Messages.tsx";
import Explore from "../components/Explore/Explore.tsx";
import SignUp from "../components/Register/SignUp.tsx";
import Login from "../components/Register/Login.tsx";
import ProfileRouter from "../components/Profile/ProfileRouter.tsx"

window.addEventListener("load", () => {
	if (
		typeof navigator.serviceWorker !== "undefined" &&
		!location.href.includes("/search/")
	) {
		navigator.serviceWorker.register("sw.js");
	}
});

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
	<HelmetProvider>
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<Routes>
					<Route path="*" element={<Login />} />
					<Route path="/register" element={<SignUp />} />
					<Route path="/search/:userid" element={<ProfileRouter />} />

					<Route element={<ProtectedRoutes />}>
						<Route path="/messages" element={<Messages />} />
						<Route path="/explore" element={<Explore />} />
						<Route path="/profile" element={<ProfileRouter/>} />
					</Route>
				</Routes>
			</BrowserRouter>
		</QueryClientProvider>
	</HelmetProvider>
);
