import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

function ResponderSurvey() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [surveyData, setSurveyData] = useState(null);
	const [questions, setQuestions] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(
		() => {
			const fetchSurveyDetails = async () => {
				try {
					const mockSurveyData = {
						id: parseInt(id),
						title: `Survey ${id} Title`,
						description: "This survey collects feedback from responders."
					};

					const mockQuestions = [
						{ id: 1, question: "What is your opinion on our product?" },
						{ id: 2, question: "How can we improve our services?" },
						{ id: 3, question: "Would you recommend us to others?" }
					];

					setSurveyData(mockSurveyData);
					setQuestions(mockQuestions);
					setLoading(false);
				} catch (error) {
					console.error("Error fetching survey details:", error);
					setLoading(false);
				}
			};

			fetchSurveyDetails();
		},
		[id]
	);

	const handleRespond = questionId => {
		navigate(`/survey/${id}/question/${questionId}/answer`);
	};

	return (
		<div className="flex flex-col min-h-screen">
			<Navbar />
			<main className="container mx-auto flex-grow py-12 px-6">
				{loading
					? <div className="flex justify-center items-center h-64">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mediumBlue" />
						</div>
					: <div>
							<h1 className="text-3xl font-bold text-darkBlue mb-4">
								{surveyData.title}
							</h1>
							<p className="text-darkBlue/80 mb-6">
								{surveyData.description}
							</p>
							<div className="grid gap-6">
								{questions.map(q =>
									<div key={q.id} className="bg-white p-6 rounded-lg shadow-md">
										<h3 className="text-lg font-semibold text-darkBlue">
											{q.question}
										</h3>
										<button
											onClick={() => handleRespond(q.id)}
											className="mt-4 bg-softBlue hover:bg-hoverBlue text-white font-medium py-2 px-6 rounded-lg shadow-md transition-all duration-300">
											Respond
										</button>
									</div>
								)}
							</div>
						</div>}
			</main>
			<Footer />
		</div>
	);
}

export default ResponderSurvey;
