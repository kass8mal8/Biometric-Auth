/* eslint-disable react/prop-types */
import home from "../../assets/images/home.png";
import chart from "../../assets/images/chart.png";
import calendar from "../../assets/images/calendar.png";
import { useNavigate } from "react-router-dom";

const BottomNav = ({ activeLink, setActiveLink }) => {
	const navigate = useNavigate();

	const handleLinkClick = (link) => {
		setActiveLink(link);

		if (link === "Home") {
			navigate("/");
		} else {
			navigate(`/${link.toLowerCase()}`);
		}
	};

	return (
		<ul className="left-1/2 -translate-x-1/2 inline-flex justify-between w-full rounded-t-xl bg-gray-600 text-white fixed bottom-0 py-5 px-7 z-10">
			<div
				className={`absolute top-3.5 bg-gray-400 p-4 rounded-full transition-all duration-300 ${
					activeLink === "Home"
						? "left-4"
						: activeLink === "Vote"
						? "left-[37%]"
						: "left-[68%]"
				} w-[26%] -z-10`}
			></div>
			<li
				className={`flex items-center space-x-2 cursor-pointer ${
					activeLink === "Home" ? "text-black" : "text-white"
				}`}
				onClick={() => handleLinkClick("Home")}
			>
				<img src={home} alt="Home" className="w-5 h-5 opacity-70" />
				<span className="text-sm">Home</span>
			</li>
			<li
				className={`flex items-center space-x-2 cursor-pointer ${
					activeLink === "Vote" ? "text-black" : "text-white"
				}`}
				onClick={() => handleLinkClick("Vote")}
			>
				<img src={chart} alt="Voting" className="w-5 h-5 opacity-70" />
				<span className="text-sm">Voting</span>
			</li>
			<li
				className={`flex items-center space-x-2 cursor-pointer ${
					activeLink === "calendar" ? "text-black" : "text-white"
				}`}
				onClick={() => handleLinkClick("calendar")}
			>
				<img src={calendar} alt="calendar" className="w-5 h-5 opacity-70" />
				<span className="text-sm">Events</span>
			</li>
		</ul>
	);
};

export default BottomNav;
