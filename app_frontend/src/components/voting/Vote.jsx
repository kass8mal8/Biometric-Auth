// import Vacants from "./Vacants";
import Voting from "./Voting";
import { useAuthContext } from "../../context/AuthContext";
import useFetch from "../../hooks/useFetch";
import { useState, useEffect } from "react";
import Message from "./Message";
import NotAllowed from "./NotAllowed";
const Vote = () => {
	const { user } = useAuthContext();
	const faculties = {
		BUS: "FoBE",
		ENG: "FoET",
		CIT: "FoCIT",
		SCT: "FoST",
		SST: "FoSST",
		MCS: "FAMECO",
	};

	const [isSubmitted, setIsSubmitted] = useState(false);
	const [isVotingAllowed, setIsVotingAllowed] = useState(true);
	const faculty = faculties[user?.admission_number.split("-")[0]];
	const url = `/requirements/${faculty}`;
	const { data, isLoading } = useFetch(url, "requirements");
	const { data: status } = useFetch(`/votes/status/${user?.id}`, "votes");
	const [selectedCandidates, setSelectedCandidates] = useState(
		JSON.parse(localStorage.getItem("selectedCandidates")) || []
	);
	console.log(data);

	useEffect(() => {
		// Check if the current time is within the allowed voting period
		const checkVotingTime = () => {
			const now = new Date();
			const startTime = new Date();
			startTime.setHours(8, 0, 0); // 8 am
			const endTime = new Date();
			endTime.setHours(18, 0, 0); // 3 pm

			if (now >= startTime && now <= endTime) {
				setIsVotingAllowed(true);
			} else {
				setIsVotingAllowed(false);
			}
		};

		checkVotingTime();
		const interval = setInterval(checkVotingTime, 60000); // Check every minute

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="left-1/2 -translate-x-1/2 ml-4 container mx-auto relative ">
			{data && (
				<>
					{isVotingAllowed ? (
						<>
							{status ? (
								<>{isSubmitted ? <Message /> : <Message />}</>
							) : (
								<Voting
									requiredVotes={data[0]?.requiredVotes}
									selectedCandidates={selectedCandidates}
									setSelectedCandidates={setSelectedCandidates}
									isVotingAllowed={isVotingAllowed}
									setIsSubmitted={setIsSubmitted}
									isSubmitted={isSubmitted}
								/>
							)}
						</>
					) : (
						<NotAllowed />
					)}
				</>
			)}
		</div>
	);
};

export default Vote;
