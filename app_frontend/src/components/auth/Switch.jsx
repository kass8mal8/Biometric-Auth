/* eslint-disable react/prop-types */
// import { useState } from "react";

const Switch = ({ isSignup, setIsSignup }) => {
	// const [isSignup, setIsSignup] = useState(true);

	const toggleSwitch = () => {
		setIsSignup(!isSignup);
	};

	return (
		<div
			className="relative my-7 md:my-0 md:mb-10 bg-neutral-200 text-xs rounded-3xl py-1 px-2 flex justify-between items-center w-3/5 md:w-[25%] mx-auto cursor-pointer"
			onClick={toggleSwitch}
		>
			<div
				className={`absolute bg-gray-800 rounded-full w-[50%] h-full transition-transform duration-300 ${
					isSignup ? "transform -translate-x-2" : "transform translate-x-[90%]"
				}`}
			></div>
			<div
				className={`relative items-center z-10 px-4 py-2  rounded-full transition-transform duration-300 ${
					!isSignup ? "text-black" : "text-white"
				}`}
			>
				Signup
			</div>
			<div
				className={`relative z-10 px-4 py-2  rounded-full transition-transform duration-300 ${
					isSignup ? "text-black" : "text-white"
				}`}
			>
				Signin
			</div>
		</div>
	);
};

export default Switch;
