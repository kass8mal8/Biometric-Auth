import { useState } from "react";
import image2 from "../../assets/images/happy-african-american-young-man-colorful-shirt-wearing-glasses-looking-camera-smiling-cheerfully.jpg";
import twilight from "../../assets/images/twilight.jpg";
import { ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion";
import submitEditedDetailsToBackend from "./profile";

const Profile = () => {
	const [toggleState, setToggleState] = useState(false);
	const [isEditing, setIsEditting] = useState(false);
	const [tel, SetTel] = useState("");
	const [faculty, setFaculty] = useState("");
	const [username, setUsername] = useState("");

	const toggleEdit = () => setIsEditting(!isEditing);

	function checkEmailValidity() {
		emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		const [isValid, setIsValid] = useState(null);
		const [email, setEmail] = useState("");
	}

	function validateEdittedChanges() {
		const slicedNumber = tel.slice(1);

		if (!faculty || !tel || !username) {
			toast.error("Fill in the details to make changes");
		} else if (slicedNumber.length < 9) {
			toast.error("Enter a valid phone number");
		} else {
			submitEditedDetailsToBackend();
		}
	}

	return (
		<>
			<div
				className="lg:flex justify-center items-center w-screen h-screen bg-cover p-0 m-0 bg-center text-black"
				style={{ backgroundImage: `url(${twilight})` }}
			>
				<div className="bg-gray-100 shadow-lg rounded-2xl h-4/5 sm:w-72 lg:w-2xl p-3 lg:h-max">
					<img
						className="w-full h-20 rounded-2xl object-cover"
						src={twilight}
					></img>
					<div className="flex justify-between items-center text-black">
						<img
							className="h-28 w-28 rounded-full object-cover"
							src={image2}
						></img>
						<div className="flex space-x-6">
							<button
								onClick={() => setToggleState((prev) => !prev)}
								className="flex space-x-2 w-24 items-center p-2 rounded-2xl border border-black cursor-pointer"
							>
								<i className="material-icons">folder</i>Archive
							</button>
							<button
								onClick={toggleEdit}
								className="border w-24 border-black p-2 rounded-2xl cursor-pointer"
							>
								Edit
							</button>
						</div>
					</div>
					<h2 className="text-lg">Peter Parker</h2>
					<p className="text-sm text-gray-400 opacity-90">test@gmail.com</p>
					<i className="material-icons">verified</i>

					{/* ALL FIELDS */}
					{toggleState ? (
						<motion.div className="bg-gray-300 overflow-y-auto  shadow-lg p-2 sm:w-72 h-80 rounded-2xl mt-7 lg:max-w-3xs">
							<h3>Babu Njoriah</h3>
							<h3>Yassin Kepha</h3>
							<h3>Koroso Derrick</h3>
							<h3>Sitonik</h3>
							<h3>Henry Marenya</h3>
							<h3>Ngozanga shyachi</h3>
							<h3>Moses</h3>
							<h3>moses david</h3>
						</motion.div>
					) : (
						<div>
							<hr className="mt-2"></hr>

							<div className="flex justify-around items-center mt-4">
								<h3>Name</h3>
								<div className="flex space-x-4">
									<h3 className="border border-black p-2 rounded-2xl w-28">
										Peter
									</h3>
									<h3 className="border border-black p-2 rounded-2xl w-28">
										Parker
									</h3>
								</div>
							</div>

							{/* Email */}
							<hr className="mt-4"></hr>
							<div className="flex justify-around items-center mt-4">
								<h3>Number</h3>
								<div className="flex space-x-4">
									{isEditing ? (
										<input
											type="tel"
											value={tel}
											onChange={(e) => SetTel(e.target.value)}
											placeholder="Active phone number"
											className="border border-black p-2 rounded-2xl"
										></input>
									) : (
										<h3>{tel}</h3>
									)}
								</div>
							</div>

							{/* faculty */}
							<hr className="mt-4"></hr>
							<div className="flex justify-around items-center mt-4">
								<h3>Faculty</h3>
								<div className="flex space-x-4">
									{isEditing ? (
										<input
											value={faculty}
											onChange={(e) => setFaculty(e.target.value)}
											className="border border-black p-2 bg-transparent rounded-2xl focus:border-black"
											placeholder="CIT"
										></input>
									) : (
										<h3>{faculty}</h3>
									)}
								</div>
							</div>

							{/* USERNAME */}
							<hr className="mt-4"></hr>
							<div className="flex justify-around items-center mt-4">
								<h3>Username</h3>
								<div className="flex space-x-4">
									{isEditing ? (
										<input
											value={username}
											onChange={(e) => setUsername(e.target.value)}
											className="border border-black p-2 bg-transparent rounded-2xl focus:border-black"
											placeholder="username"
										></input>
									) : (
										<h3>{username}</h3>
									)}
								</div>
							</div>

							{/* Buttons */}
							<hr className="mt-4"></hr>
							<div className="flex mt-4 space-x-6 float-right">
								<button className="border border-black p-2 rounded-2xl cursor-pointer opacity-50">
									Cancel
								</button>
								<button
									onClick={validateEdittedChanges}
									className="border border-black cursor-pointer p-2 rounded-2xl opacity-100"
								>
									Save changes
								</button>
							</div>
						</div>
					)}
				</div>
				{/* VOTING CONTAINER */}
			</div>
			<ToastContainer />
		</>
	);
};

export default Profile;
