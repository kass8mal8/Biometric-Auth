import timeout from "../../assets/images/timeout.svg";

const NotAllowed = () => {
	return (
		<div className="text-center mt-3">
			<img src={timeout} alt="timeout" />
			<p className="text-lg my-2">
				Oops! Outside voting time. Try again later.
			</p>
		</div>
	);
};

export default NotAllowed;
