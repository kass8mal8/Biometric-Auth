import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: 'https://biometric-auth.onrender.com/api',
});

export default axiosInstance;
