/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { isAxiosError } from "axios";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(() => {
		// Retrieve user from localStorage on initialization
		const storedUser = localStorage.getItem("user");
		try {
			return storedUser ? JSON.parse(storedUser) : null;
		} catch (error) {
			console.error("Failed to parse user from localStorage:", error);
			return null;
		}
	});

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const res = await axiosInstance.get("/auth/profile", {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
					},
				});
				console.log("Response:", res.data);
				setUser(res?.data);
				// Save user to localStorage
				localStorage.setItem("user", JSON.stringify(res?.data));
			} catch (error) {
				isAxiosError(error) && console.log(error.message);
				// Clear user data if the profile fetch fails
				localStorage.removeItem("user");
				localStorage.removeItem("accessToken");
				setUser(null);
			}
		};

		// Only fetch profile if user is not already in localStorage
		if (!user) {
			fetchProfile();
		}
	}, []);

	return (
		<AuthContext.Provider value={{ user, setUser }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuthContext = () => {
	const context = useContext(AuthContext);

	if (context === undefined) {
		throw new Error("Context must be used within an AuthProvider");
	}

	return context;
};
