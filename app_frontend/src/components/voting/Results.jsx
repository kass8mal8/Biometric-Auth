import useFetch from "../../hooks/useFetch";

const Results = () => {
	const d = new Date();

	const { data: results } = useFetch(`/votes/${d.getFullYear()}`, "votes");

	return (
		<div className="left-1/2 -translate-x-1/2 ml-4 container mx-auto relative ">
			<h1 className="text-3xl font-bold text-gray-800 mb-6">Results</h1>
			{results ? (
				<div className="rounded-lg">
					<h2 className="text-xl text-gray-800 mb-4">Winner(s):</h2>
					{results.winner && results.winner.length > 0 ? (
						results.winner.map((winner) => (
							<div
								key={winner._id}
								className="winner-card rounded p-4 mb-4 bg-gray-200"
							>
								<p className="text-lg font-medium text-gray-700">
									<strong>Name:</strong> {winner.name}
								</p>
								<p className="text-lg font-medium text-gray-700">
									<strong>Votes Received:</strong>{" "}
									{results.voteCounts?.find(
										(candidate) => candidate._id === winner._id
									)?.votes || 0}
								</p>
							</div>
						))
					) : (
						<p className="text-lg text-gray-700">No winners found.</p>
					)}
					<p className="text-lg text-gray-600">
						<strong>Total Votes:</strong> {results.votes?.length || 0}
					</p>
					<p className="text-lg text-gray-600">
						<strong>Maximum Votes:</strong> {results.maxVotes || 0}
					</p>
				</div>
			) : (
				<p className="text-lg text-gray-700 text-center">Loading results...</p>
			)}
		</div>
	);
};

export default Results;
