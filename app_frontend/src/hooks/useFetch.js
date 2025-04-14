import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import { isAxiosError } from "axios";

const useFetch = (endpoint, queryKey, customHeaders = {}) => {
	const fetch = async () => {
		try {
			const headers = { ...customHeaders };
			const res = await axiosInstance.get(endpoint, { headers });
			if (res.data) {
				return res.data;
			} else {
				throw new Error("No data returned from the server.");
			}
		} catch (error) {
			if (isAxiosError(error)) {
				throw new Error(error.response?.data?.message || error.message);
			}
		}
	};

	const { data, isLoading, error } = useQuery({
		queryKey: [queryKey],
		queryFn: fetch,
	});

	return { data, isLoading, error };
};

export default useFetch;
