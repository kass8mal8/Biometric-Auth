/* eslint-disable react/prop-types */
import pdf from "../../assets/images/pdf.png";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import usePost from "../../hooks/usePost";

const CandidateRegistration = ({ selectedPosition }) => {
	const { user } = useAuthContext();
	console.log("Position selected: " + selectedPosition);
	const { post, loading } = usePost("/candidates/add_candidate");
	const [userDetails, setUserDetails] = useState({
		name: "",
		admission_number: user?.admission_number,
		telephone: user?.phone_number,
		position_title: selectedPosition && selectedPosition,
	});
	const [isValidName, setIsValidName] = useState(false);

	const handleChange = (e) => {
		setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
	};

	useEffect(() => {
		const nameParts = userDetails.name.trim().split(" ");
		setIsValidName(nameParts.length > 1);
	}, [userDetails]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const res = await post(userDetails);
			console.log(res);
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<div className="left-1/2 -translate-x-1/2 ml-4 container mx-auto relative ">
			<h1 className="text-xl my-5">Enter your full name below</h1>
			<form onSubmit={handleSubmit}>
				<aside className="flex space-x-3 items-center my-5">
					<img src={pdf} alt="pdf" className="w-10 h-10" />
					<p className="text-lg">Document name.pdf</p>
				</aside>
				<input
					className="p-3 border border-neutral-400 rounded-lg focus:outline-none"
					type="text"
					placeholder="full official name"
					name="name"
					value={userDetails.name}
					onChange={handleChange}
				/>
				<button
					type="submit"
					className="p-3 mt-5 bg-gray-600 text-white rounded-lg w-full"
					disabled={!isValidName}
				>
					Download nomination form
				</button>
			</form>
		</div>
	);
};

export default CandidateRegistration;
