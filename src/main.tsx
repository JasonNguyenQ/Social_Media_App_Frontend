import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { lazy, Suspense } from 'react'
import "./index.css";

const ProtectedRoutes = lazy(()=> import("./ProtectedRoutes.tsx"));
const Messages = lazy(()=> import("../components/Messages/Messages.tsx"));
const Explore = lazy(()=> import("../components/Explore/Explore.tsx"));
const SignUp = lazy(()=> import("../components/Register/SignUp.tsx"));
const Login = lazy(()=> import("../components/Register/Login.tsx"));
const ProfileRouter = lazy(()=> import("../components/Profile/ProfileRouter.tsx"))

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
	<HelmetProvider>
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<Suspense fallback={<div>Loading...</div>}>
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
				</Suspense>
			</BrowserRouter>
		</QueryClientProvider>
	</HelmetProvider>
);