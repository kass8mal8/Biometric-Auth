import { useState, useEffect, useMemo } from "react";
import { useAuthContext } from "../../context/AuthContext";
import profile from "../../assets/images/profile.png";

const Header = () => {
	const { user } = useAuthContext();
	const currentHour = useMemo(() => new Date().getHours(), []);
	const [greeting, setGreeting] = useState("");
	console.log(user);

	const getGreeting = (hour) => {
		if (hour >= 0 && hour < 12) {
			return "Good Morning";
		} else if (hour >= 12 && hour < 18) {
			return "Good Afternoon";
		} else {
			return "Good Evening";
		}
	};

	useEffect(() => {
		setGreeting(getGreeting(currentHour));
	}, [currentHour]);

	return (
		<>
			<div className="sticky z-40 bg-white flex justify-between items-center top-0 w-[100vw] p-4">
				<section>
					<p className=" my-1 text-lg text-neutral-600">{greeting},</p>
					<h2 className=" text-xl ">{user?.admission_number}</h2>
				</section>
				<aside className="p-2 ">
					<img src={profile} alt="profile" className="w-8 h-8 opacity-70" />
				</aside>
			</div>
		</>
	);
};

export default Header;
