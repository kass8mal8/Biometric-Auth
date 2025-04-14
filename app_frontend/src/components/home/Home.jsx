/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import arrow from "../../assets/images/arrow.png";
import Timer from "./Timer";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";

const Home = ({ setActiveLink }) => {
	const navigate = useNavigate();
	const { user } = useAuthContext();
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		if (isAuthenticated) {
			navigate("/vote");
		}
	}, [user, isAuthenticated, navigate, setActiveLink]);
	console.log(window.PublicKeyCredential);

	// Function to handle biometric authentication
	const handleBiometricAuth = async () => {
		if (window.PublicKeyCredential) {
			try {
				// Generate a random challenge locally
				const challenge = new Uint8Array(32);
				window.crypto.getRandomValues(challenge);
				console.log("Generated Challenge:", challenge);

				// Trigger WebAuthn API for biometric authentication
				const credential = await navigator.credentials.get({
					publicKey: {
						challenge, // Use the locally generated challenge
						rpId: window.location.hostname, // Ensure this matches your domain
						userVerification: "required", // Require biometric or device password
						authenticatorSelection: {
							authenticatorAttachment: "platform", // Prioritize platform authenticators (e.g., Windows Hello)
						},
					},
				});

				if (credential) {
					setIsAuthenticated(true);
					alert("Biometric authentication successful!");
				}
			} catch (error) {
				console.error("Biometric authentication failed:", error);
				alert("Authentication failed. Please try again.");
			}
		} else {
			alert("Biometric authentication is not supported on this device.");
		}
	};

	return (
		<div>
			{/* Main container */}
			<div className="left-1/2 -translate-x-1/2 ml-4 container mx-auto relative">
				{/* Button to trigger biometric authentication */}
				<div
					className="w-full rounded-lg bg-neutral-200 p-4 my-4 flex justify-between cursor-pointer"
					onClick={handleBiometricAuth}
				>
					<aside>
						<p>Proceed to vote</p>
					</aside>
					<img src={arrow} alt="arrow" className="w-6 h-6" />
				</div>
			</div>
		</div>
	);
};

export default Home;
