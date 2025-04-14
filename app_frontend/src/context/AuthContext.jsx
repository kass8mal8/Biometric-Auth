/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { isAxiosError } from "axios";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const res = await axiosInstance.get("/auth/profile", {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
					},
				});
				setUser(res.data?.user);
			} catch (error) {
				isAxiosError(error) && console.log(error.message);
			}
		};

		fetchProfile();
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
