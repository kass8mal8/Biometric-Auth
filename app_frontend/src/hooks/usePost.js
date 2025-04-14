import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { isAxiosError } from "axios";

const usePost = (url) => {
	const [loading, setLoading] = useState(false);

	const post = async (body) => {
		setLoading(true);
		try {
			const res = await axiosInstance.post(url, body, {
				headers: {
					"Content-Type": "application/json",
				},
				withCredentials: true,
			});

			return res.data;
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				throw error.response.data;
			} else {
				throw new Error("An unexpected error occurred");
			}
		} finally {
			setLoading(false);
		}
	};

	return { post, loading };
};

export default usePost;
