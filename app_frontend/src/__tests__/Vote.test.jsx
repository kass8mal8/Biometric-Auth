import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Vote from "../components/voting/Vote";
import { AuthContext } from "../context/AuthContext";
import useFetch from "../hooks/useFetch";

// Mock the custom hooks and context
jest.mock("../../hooks/useFetch");
jest.mock("../../context/AuthContext");

describe("Vote Component", () => {
	const mockUser = { admission_number: "BUS-12345" };
	const mockData = [{ requiredVotes: 3 }];

	beforeEach(() => {
		// Mock the AuthContext
		AuthContext.mockImplementation(({ children }) => (
			<AuthContext.Provider value={{ user: mockUser }}>
				{children}
			</AuthContext.Provider>
		));

		// Mock the useFetch hook
		useFetch.mockReturnValue({
			data: mockData,
			isLoading: false,
		});
	});

	it("renders the Voting component when voting is allowed", async () => {
		render(<Vote />);

		// Ensure the Voting component is rendered
		expect(screen.getByText(/Voting/i)).toBeInTheDocument();
	});

	it("displays the NotAllowed component when voting is not allowed", async () => {
		// Override the useFetch mock to simulate outside voting hours
		jest.useFakeTimers().setSystemTime(new Date("2023-10-10T16:00:00Z"));

		render(<Vote />);

		// Ensure the NotAllowed component is rendered
		expect(screen.getByText(/Not Allowed/i)).toBeInTheDocument();

		// Restore the timers after the test
		jest.useRealTimers();
	});

	it("displays the Message component when all votes are submitted", async () => {
		// Mock localStorage with selected candidates
		const selectedCandidates = ["candidate1", "candidate2", "candidate3"];
		localStorage.setItem(
			"selectedCandidates",
			JSON.stringify(selectedCandidates)
		);

		render(<Vote />);

		// Wait for the Message component to appear
		await waitFor(() => {
			expect(screen.getByText(/Message/i)).toBeInTheDocument();
		});
	});

	it("allows selecting candidates and submitting votes", async () => {
		render(<Vote />);

		// Simulate selecting candidates
		const candidateCheckbox = screen.getByRole("checkbox", {
			name: /Candidate 1/i,
		});
		userEvent.click(candidateCheckbox);

		// Simulate submitting votes
		const submitButton = screen.getByRole("button", { name: /Submit Votes/i });
		userEvent.click(submitButton);

		// Verify that the submission logic is triggered
		expect(localStorage.getItem("selectedCandidates")).not.toBeNull();
	});
});
