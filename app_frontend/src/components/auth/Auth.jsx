import { useState, useEffect, useRef } from 'react';
import illustration from '../../assets/images/illustration.png';
import Switch from './Switch';
import usePost from '../../hooks/usePost';
import pass_visible from '../../assets/images/pass_visible.png';
import pass_hidden from '../../assets/images/pass_hidden.png';
import Otp from './Otp';
import { useAuthContext } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
	const [isSignup, setIsSignup] = useState(false);
	const { post, loading, error } = usePost(
		`/auth/${isSignup ? 'signup' : 'signin'}`
	);
	const [userDetails, setUserDetails] = useState({
		admission_number: '',
		email: null,
		password: '',
	});
	const [isVisible, setIsVisible] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const modalRef = useRef();
	const [errors, setErrors] = useState({
		email: [],
		password: [],
		admission_number: [],
	});
	const faculties = ['CIT', 'BUS', 'SCT', 'ENG', 'MCS', 'SST'];

	const handleInputChange = async (e) => {
		const { name, value } = e.target;
		setUserDetails({ ...userDetails, [name]: value });

		// Create a new errors object
		const newErrors = { ...errors };

		if (name === 'email') {
			// Validate email format using regex
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			newErrors.email = !emailRegex.test(value)
				? ['Invalid email format']
				: [];
		}

		if (name === 'password') {
			// Validate password strength
			// Updated password regex that allows special characters
			const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

			newErrors.password = !passwordRegex.test(value)
				? [
						'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number',
				  ]
				: [];
		}

		if (name === 'admission_number') {
			const admissionNumberRegex = /^[A-Z]{3}-\d{3}-\d{3}\/\d{4}$/;
			const d = new Date();
			const currentYear = d.getFullYear().toString();

			if (value.length === 16) {
				const year = value.split('/')[1];
				const faculty = value.split('-')[0].toUpperCase();

				if (
					!admissionNumberRegex.test(value) ||
					!faculties.includes(faculty) ||
					year >= currentYear
				) {
					newErrors.admission_number = ['Invalid admission number'];
				}
			} else if (value.length === 1) {
				newErrors.admission_number = ['Invalid admission number'];
			} else {
				newErrors.admission_number = [];
			}
		}

		setErrors(newErrors);
	};

	const handleAuth = async (e) => {
		e.preventDefault();
		try {
			// Step 1: Signup or Signin

			if (!Object.values(errors).flat().length === 0) {
				return;
			} else {
				const res = await post(userDetails);
				console.log(res);
			}
			console.log(error);

			// Step 2: Handle passkey registration or verification
			if (isSignup) {
				setIsSignup(false);
				await registerPasskey(userDetails?.email); // Register passkey during signup
			} else {
				setIsOpen(true);
				// await verifyPasskey(userDetails?.email); // Verify passkey during signin
			}
		} catch (error) {
			console.log('Error:', error.message.split(':')[2]);
			const errorMessage =
				error.message.split(':')[2] === ' email_1 dup key'
					? 'Email already exists'
					: 'Admission number already exists';
			isSignup ? alert(errorMessage) : alert(error.message);
		}
	};

	const handleClose = (e) => {
		setIsOpen(false);
		modalRef.current?.close();
	};

	useEffect(() => {
		if (isOpen) modalRef.current?.showModal();
	}, [isOpen, userDetails]);

	// Helper to convert base64url to Uint8Array
	const base64urlToUint8Array = (base64url) => {
		try {
			if (!base64url || typeof base64url !== 'string') {
				throw new Error('Base64url input must be a non-empty string');
			}
			// Ensure the input is a valid base64url string
			if (!/^[A-Za-z0-9\-_]+$/.test(base64url)) {
				throw new Error('Invalid base64url format');
			}
			const padding = '='.repeat((4 - (base64url.length % 4)) % 4);
			const base64 = (base64url + padding)
				.replace(/-/g, '+')
				.replace(/_/g, '/');
			const decoded = atob(base64);
			if (!decoded) {
				throw new Error('Decoded base64url string is empty');
			}
			return Uint8Array.from(decoded, (c) => c.charCodeAt(0));
		} catch (error) {
			throw new Error(`Failed to decode base64url: ${error.message}`);
		}
	};

	// Helper to convert Uint8Array to base64url
	const uint8ArrayToBase64url = (array) => {
		try {
			const base64 = btoa(String.fromCharCode(...array));
			return base64
				.replace(/\+/g, '-')
				.replace(/\//g, '_')
				.replace(/=+$/, '');
		} catch (error) {
			throw new Error(`Failed to encode base64url: ${error.message}`);
		}
	};

	const registerPasskey = async (email) => {
		try {
			// Step 1: Fetch registration challenge
			const response = await axiosInstance.get(
				`/auth/generate-registration-challenge/${email}`
			);
			const options = response.data;

			// Debugging: Log the backend response
			console.log('Options from backend:', options);

			// Validate options
			if (!options || typeof options !== 'object') {
				throw new Error(
					'Invalid backend response: Options is not an object'
				);
			}
			if (!options.challenge || typeof options.challenge !== 'string') {
				throw new Error(
					'Invalid backend response: Missing or invalid challenge'
				);
			}
			if (
				!options.user ||
				!options.user.id ||
				typeof options.user.id !== 'string'
			) {
				throw new Error(
					'Invalid backend response: Missing or invalid user ID'
				);
			}
			if (
				!options.rp ||
				!options.pubKeyCredParams ||
				!options.authenticatorSelection
			) {
				throw new Error(
					'Invalid backend response: Missing required WebAuthn parameters'
				);
			}

			// Step 2: Create passkey credential
			const publicKey = {
				challenge: base64urlToUint8Array(options.challenge),
				rp: options.rp,
				user: {
					id: base64urlToUint8Array(options.user.id),
					name: email,
					displayName: email,
				},
				pubKeyCredParams: options.pubKeyCredParams,
				authenticatorSelection: {
					authenticatorAttachment: 'platform',
					userVerification: 'preferred',
				},
				timeout: options.timeout || 60000, // Default to 60 seconds if not provided
			};

			const credential = await navigator.credentials.create({
				publicKey,
			});
			console.log('Credential created:', credential);

			// Step 3: Send credential to server for storage
			const credentialData = {
				id: credential.id,
				rawId: uint8ArrayToBase64url(credential.rawId),
				type: credential.type,
				response: {
					clientDataJSON: uint8ArrayToBase64url(
						credential.response.clientDataJSON
					),
					attestationObject: uint8ArrayToBase64url(
						credential.response.attestationObject
					),
				},
			};

			console.log('Credential data to send:', credentialData);

			const saveResponse = await axiosInstance.post(
				'/auth/save-passkey',
				{
					email,
					credential: credentialData,
				}
			);

			if (saveResponse.status === 200) {
				console.log('Passkey registered successfully!');
				alert('Passkey registered successfully!');
			} else {
				throw new Error('Failed to save passkey on server');
			}
		} catch (error) {
			console.error('Passkey registration failed:', error);
		}
	};

	return (
		<div className="md:flex justify-between items-center h-screen">
			<div className="w-[100vw] h-[45vh] md:h-auto md:w-2/3 bg-gray-700 md:rounded-tr-4xl rounded-b-2xl">
				<img
					src={illustration}
					alt="illustration"
					className="w-2/3 mx-auto md:w-full"
				/>
			</div>
			<form
				className="relative bottom-0 w-full ml-4 md:w-3/4 mx-auto"
				onSubmit={handleAuth}
			>
				<Switch setIsSignup={setIsSignup} isSignup={isSignup} />

				<input
					type="email"
					placeholder="Email"
					name="email"
					onChange={handleInputChange}
					className={`${
						errors.email.length > 0
							? 'border border-red-400'
							: 'border border-neutral-400'
					} p-3 focus:outline-none rounded-full block mx-auto my-4 w-full md:w-[45%]`}
				/>
				{errors.email.length > 0 && (
					<p className="text-red-500 text-sm ml-4 md:ml-[27.5%] -mt-2 mb-2">
						{errors.email[0]}
					</p>
				)}

				{isSignup && (
					<>
						<input
							type="text"
							placeholder="Admission Number"
							name="admission_number"
							onChange={handleInputChange}
							className={`${
								errors.admission_number.length > 0
									? 'border border-red-400'
									: 'border border-neutral-400'
							} p-3 focus:outline-none rounded-full block mx-auto my-4 w-full md:w-[45%]`}
						/>
						{errors.admission_number.length > 0 && (
							<p className="text-red-500 text-sm ml-4 md:ml-[27.5%] -mt-2 mb-2">
								{errors.admission_number[0]}
							</p>
						)}
					</>
				)}

				<aside className="relative">
					<input
						type={isVisible ? 'text' : 'password'}
						placeholder="Password"
						name="password"
						onChange={handleInputChange}
						className={`${
							errors.password.length > 0
								? 'border border-red-400'
								: 'border border-neutral-400'
						} p-3 focus:outline-none rounded-full block mx-auto my-4 w-full md:w-[45%]`}
					/>
					{errors.password.length > 0 && (
						<p className="text-red-500 text-sm ml-4 md:ml-[27.5%] -mt-2 mb-2">
							{errors.password[0]}
						</p>
					)}
					<img
						src={!isVisible ? pass_visible : pass_hidden}
						alt="visibility"
						onClick={() => setIsVisible(!isVisible)}
						className="w-5 cursor-pointer absolute right-3 md:right-[30%] top-5 opacity-50"
					/>
				</aside>
				<button
					type="submit"
					className={`mx-auto w-full md:w-[45%] text-white bg-gray-800 p-3 rounded-full block my-2 ${
						loading && 'bg-neutral-200 text-black'
					}`}
				>
					{loading ? 'processing...' : isSignup ? 'Signup' : 'Signin'}
				</button>
			</form>
			<dialog
				ref={modalRef}
				onClick={handleClose}
				className="mx-auto h-full md:h-[55%] mt-[50%] md:mt-[10%] p-0  md:mb-auto py-5 px-2 w-full md:w-[60%] rounded-2xl max-w-[50ch] backdrop:opacity-50 backdrop:bg-black"
			>
				<Otp email={userDetails?.email} />
			</dialog>
		</div>
	);
};

export default Auth;
