import Auth from "./components/auth/Auth";
import { Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./components/home/Home";
import Vote from "./components/voting/Vote";
import Header from "./components/navigation/Header";
import BottomNav from "./components/navigation/BottomNav";
import { useState } from "react";
import Positions from "./components/voting/Positions";

function App() {
	const location = useLocation();
	const [activeLink, setActiveLink] = useState("Home");

	return (
		<AuthProvider>
			<div className=" sm:w-full w-[90%] sm:mx-auto relative">
				{location.pathname !== "/auth" && (
					<>
						<Header />
						{/* <BottomNav activeLink={activeLink} setActiveLink={setActiveLink} /> */}
					</>
				)}

				<Routes>
					<Route path="/auth" element={<Auth />} />
					<Route path="/" element={<Home setActiveLink={setActiveLink} />} />
					<Route path="/positions" element={<Positions />} />
					<Route path="/vote" element={<Vote />} />
				</Routes>
			</div>
		</AuthProvider>
	);
}

export default App;
