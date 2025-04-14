import { useEffect, useState, useRef } from "react";
import useFetch from "../../hooks/useFetch";
import { useAuthContext } from "../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../utils/axiosInstance";
// import pdf from "/sample_nomination_form.pdf";

const Positions = () => {
	const { user } = useAuthContext();
	const encodedAdmissionNumber = encodeURIComponent(user?.admission_number);
	const url = `/positions/`;
	const { data: positions, isLoading } = useFetch(url, "positions", {
		Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
	});

	console.log(positions);

	const [studentCouncil, setStudentCouncil] = useState([]);
	const [congress, setCongress] = useState([]);
	const [newCongress, setNewCongress] = useState({});
	const delegateRef = useRef(null);
	const faculty = user?.admission_number.split("-")[0];

	const faculties = {
		CIT: "FoCIT",
		ENG: "FoET",
		SCT: "FoST",
		SST: "FoSST",
		MCS: "FAMECO",
		BUS: "FoBE",
	};

	const facultyRep = newCongress && newCongress["Faculty Rep"];

	const [selectedPosition, setSelectedPosition] = useState(
		JSON.parse(localStorage.getItem("selectedPosition"))
	);
	const [pdfUrl, setPdfUrl] = useState(null);

	const handleAddCandidate = async (candidateDetails) => {
		try {
			const res = await axiosInstance.post(
				"/candidates/add_candidate",
				candidateDetails
			);
			console.log(res);
		} catch (error) {
			console.log("Error adding candidate:", error.message);
		}
	};

	useEffect(() => {
		const candidateDetails = {
			name: "Kassim Ali",
			admission_number: user?.admission_number,
			telephone: user?.phone_number,
			position_title: selectedPosition?.position_title,
		};
		if (selectedPosition) {
			localStorage.setItem(
				"selectedPosition",
				JSON.stringify(selectedPosition)
			);
			handleAddCandidate(candidateDetails);
		}
	}, [selectedPosition]);

	return (
		<div className="left-1/2 -translate-x-1/2 ml-4 container mx-auto relative">
			<ToastContainer />
			{positions?.map((position) => (
				<div
					key={position._id}
					className="bg-gray-200 py-4 pl-3 text-lg w-full rounded my-2 cursor-pointer hover:bg-gray-300"
					onClick={() => {
						setSelectedPosition(position);
						// fetchNominationForm(position);
					}}
				>
					<p>{position.position_group}</p>
				</div>
			))}
		</div>
	);
};

export default Positions;
