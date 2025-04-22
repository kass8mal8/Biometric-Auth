import { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { isAxiosError } from 'axios';

const usePost = (url) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const post = async (body) => {
		setLoading(true);
		try {
			const res = await axiosInstance.post(url, body, {
				headers: {
					'Content-Type': 'application/json',
				},
				withCredentials: true,
			});

			return res.data;
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				setError(error.response.data);
				throw error.response.data;
			} else {
				setError('An unexpected error occurred');
				throw new Error('An unexpected error occurred');
			}
		} finally {
			// setError(null);
			setLoading(false);
		}
	};

	return { post, loading, error };
};

export default usePost;
