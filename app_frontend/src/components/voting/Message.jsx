/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import tick from "../../assets/images/tick.png";

const Message = () => {
	const [imageLoaded, setImageLoaded] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		// Preload the image
		const img = new Image();
		img.src = tick;
		img.onload = () => setImageLoaded(true);

		// Navigate to the results page after 2 seconds
		const timer = setTimeout(() => {
			navigate("/results");
		}, 2000);

		// Cleanup the timer on component unmount
		return () => clearTimeout(timer);
	}, [navigate]);

	return (
		<div className="p-2 text-center">
			{imageLoaded && <img src={tick} alt="tick" />}
			<p className="text-xl text-center">
				Thank you for casting your vote... sit tight as we tally the votes!
			</p>
		</div>
	);
};

export default Message;
