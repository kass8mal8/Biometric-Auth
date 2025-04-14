/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import tick from "../../assets/images/tick.png";
const Message = () => {
	const [imageLoaded, setImageLoaded] = useState(false);

	useEffect(() => {
		const img = new Image();
		img.src = tick;
		img.onload = () => setImageLoaded(true);
	}, []);

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
