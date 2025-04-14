import { useState, useEffect } from "react";

const Timer = () => {
	const [daysLeft, setDaysLeft] = useState(null);
	const [hoursLeft, setHoursLeft] = useState(null);
	const [minutesLeft, setMinutesLeft] = useState(null);
	const [secondsLeft, setSecondsLeft] = useState(null);

	const calculateTimeLeft = () => {
		const today = new Date();
		const targetDate = new Date(today.getFullYear(), 2, 4); // March 3rd of the current year

		// If today's date is after March 3rd, calculate for the next year
		if (today > targetDate) {
			targetDate.setFullYear(today.getFullYear() + 1);
		}

		const diffTime = targetDate - today;
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
		const diffHours = Math.floor(
			(diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
		);
		const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
		const diffSeconds = Math.floor((diffTime % (1000 * 60)) / 1000);

		setDaysLeft(diffDays);
		setHoursLeft(diffHours);
		setMinutesLeft(diffMinutes);
		setSecondsLeft(diffSeconds);
	};

	useEffect(() => {
		calculateTimeLeft();
		const timer = setInterval(calculateTimeLeft, 1000); // Update every second

		return () => clearInterval(timer); // Cleanup the interval on component unmount
	}, []);

	return (
		<div className="bg-gray-500 p-3 my-4 rounded-lg text-white">
			<div className="w-full flex items-center justify-between ">
				<aside className="text-center">
					<span className="text-sm">Days</span>
					<p className="text-4xl bold mt-2 py-1 rounded-lg bg-white text-neutral-700 w-20">
						{daysLeft}
					</p>
				</aside>
				<aside className="text-center">
					<span className="text-sm">Hours</span>
					<p className="text-4xl mt-2 bold py-1 rounded-lg bg-white text-neutral-700 w-15">
						{hoursLeft}
					</p>
				</aside>
				<aside className="text-center">
					<span className="text-sm">Minutes</span>
					<p className="text-4xl mt-2 bold py-1 rounded-lg bg-white text-neutral-700 w-15">
						{minutesLeft}
					</p>
				</aside>
			</div>
			<p className="text-5xl bold mt-3 text-center">
				{secondsLeft} <span className="text-sm"></span>
			</p>
		</div>
	);
};

export default Timer;
