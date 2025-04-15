import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useAuthContext } from "../../context/AuthContext";
import useFetch from "../../hooks/useFetch";
import {
	GoogleReCaptchaProvider,
	useGoogleReCaptcha,
} from "react-google-recaptcha-v3";
import { useNavigate } from "react-router-dom";

const Voting = ({
	selectedCandidates,
	setSelectedCandidates,
	isVotingAllowed,
	setIsSubmitted,
	isSubmitted,
}) => {
	const [delegates, setDelegates] = useState([]);
	const [errorMessage, setErrorMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { executeRecaptcha } = useGoogleReCaptcha(); // Access reCAPTCHA methods
	const { user } = useAuthContext();
	const requiredVotes = 1;

	const encodedAdmissionNumber = encodeURIComponent(user?.admission_number);
	const url = `/candidates/${encodedAdmissionNumber}/Electoral College Representative`;

	const { data: candidates } = useFetch(url, "candidates", {
		Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
	});
	const navigate = useNavigate();

	useEffect(() => {
		if (candidates) {
			const filtered = candidates.filter(
				(candidate) =>
					candidate.position_title === "Electoral College Representative"
			);
			setDelegates(filtered);
		}
	}, [candidates]);

	useEffect(() => {
		if (errorMessage) {
			const timer = setTimeout(() => {
				setErrorMessage("");
			}, 4000);
			return () => clearTimeout(timer);
		}
	}, [errorMessage]);

	// Generate reCAPTCHA token and handle voting
	const handleVote = async () => {
		if (!executeRecaptcha) {
			setErrorMessage("reCAPTCHA not loaded. Please try again.");
			return;
		}

		if (selectedCandidates.length === requiredVotes) {
			setIsLoading(true);

			try {
				// Generate reCAPTCHA token
				const token = await executeRecaptcha("submit");

				// Send the token to the backend with the vote data
				const accessToken = localStorage.getItem("accessToken");
				await axiosInstance.post(
					"/votes/vote",
					{
						candidate_ids: selectedCandidates,
						requiredVotes,
						captchaToken: token,
					},
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				);

				setIsSubmitted(true);
				navigate("/results");
			} catch (error) {
				if (error.response && error.response.data) {
					console.log(error.response.data.message);
					setErrorMessage(error.response.data.message);
				} else {
					setErrorMessage("An unexpected error occurred. Please try again.");
				}
			} finally {
				setIsLoading(false);
			}
		} else {
			setErrorMessage(`You must select exactly ${requiredVotes} candidates.`);
		}
	};

	const handleCandidateSelection = (candidate_id) => {
		setSelectedCandidates((prevSelected) => {
			if (!isVotingAllowed) {
				return prevSelected;
			} else {
				if (prevSelected.includes(candidate_id)) {
					return prevSelected.filter((id) => id !== candidate_id);
				} else if (prevSelected.length < requiredVotes) {
					return [...prevSelected, candidate_id];
				} else {
					return prevSelected;
				}
			}
		});
	};
	console.log("State", isSubmitted);

	return (
		<div className="z-40">
			<dialog open={!!errorMessage} className="bg-red-200 p-2 rounded">
				<p>{errorMessage}</p>
			</dialog>
			<h1 className="text-xl mb-4">{delegates[0]?.position_title}</h1>
			<p className="mb-4 text-lg">
				Select {requiredVotes} candidates to vote for.
			</p>
			{delegates.map((candidate, index) => (
				<div
					key={index}
					className={`my-2 flex justify-between items-center p-3 rounded cursor-pointer ${
						selectedCandidates.includes(candidate._id)
							? "bg-blue-100"
							: "bg-neutral-300"
					}`}
					onClick={() => handleCandidateSelection(candidate._id)}
				>
					<aside>
						<p className="font-semibold">{candidate.name}</p>
						<h3 className="text-sm text-gray-600">
							{candidate.admission_number}
						</h3>
					</aside>
					<input
						name="vote"
						id={candidate._id}
						type="checkbox"
						className="w-6 h-6"
						checked={selectedCandidates.includes(candidate._id)}
						onChange={() => handleCandidateSelection(candidate._id)}
					/>
				</div>
			))}
			<button
				className={`py-3 rounded mt-4 w-full tracking-wider ${
					!isVotingAllowed || selectedCandidates.length !== requiredVotes
						? "bg-neutral-100 cursor-not-allowed"
						: "bg-gray-600 text-white"
				} ${isLoading ? "bg-gray-200 cursor-wait" : ""}`}
				onClick={handleVote}
				disabled={
					!isVotingAllowed ||
					selectedCandidates.length !== requiredVotes ||
					isLoading
				}
			>
				{isLoading ? "Processing..." : "Submit Vote"}
			</button>
		</div>
	);
};

// Wrap the Voting component with GoogleReCaptchaProvider
const VotingWithRecaptcha = (props) => {
	return (
		<GoogleReCaptchaProvider reCaptchaKey="6Lc8DvUqAAAAAJA0xFVK5lq1SQjm3eek_PnGgQO2">
			<Voting {...props} />
		</GoogleReCaptchaProvider>
	);
};

export default VotingWithRecaptcha;
