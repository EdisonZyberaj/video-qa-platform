import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import { Eye, Save } from "lucide-react";
import axios from "axios";

function Survey() {
	const { id } = useParams();
	console.log("Survey ID:", id);
	const navigate = useNavigate();
	const [surveyData, setSurveyData] = useState(null);
	const [questions, setQuestions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchSurveyDetails = async () => {
			try {
				const token = sessionStorage.getItem("token");

				if (!token) {
					console.error("No token found. Redirecting to login.");
					navigate("/login");
					return;
				}

				// First, fetch the survey details
				console.log("Fetching survey details...");
				const surveyResponse = await axios.get(`http://localhost:5000/api/surveys/${id}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				console.log("Survey data received:", surveyResponse.data);
				const survey = surveyResponse.data;

				setSurveyData({
					id: survey.survey_id,
					title: survey.title,
					description: survey.description,
				});

				// Then, fetch questions separately
				console.log("Fetching questions...");
				const questionsResponse = await axios.get(`http://localhost:5000/api/surveys/${id}/questions`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				console.log("Questions data received:", questionsResponse.data);
				
				// Set the questions directly
				if (Array.isArray(questionsResponse.data)) {
					setQuestions(questionsResponse.data);
				} else {
					console.error("Questions data is not an array:", questionsResponse.data);
					setError("Failed to load questions properly");
					setQuestions([]);
				}

				setLoading(false);
			} catch (error) {
				console.error("Error fetching survey details:", error);
				setError("Failed to load survey data: " + (error.response?.data?.error || error.message));
				setLoading(false);
				if (error.response && error.response.status === 401) {
					navigate("/login");
				}
			}
		};

		fetchSurveyDetails();
	}, [id, navigate]);

	const handleBack = () => {
		navigate("/surveys");
	};

	const handleViewAnswers = () => {
		navigate(`/survey/${id}/responders`);
	};

	return (
		<div className="flex flex-col min-h-screen bg-gradient-to-b from-lightBlue/30 to-lightBlue/50">
			<Navbar />
			<main className="container mx-auto flex-grow py-12 px-4 max-w-5xl">
				{loading ? (
					<div className="flex justify-center items-center h-64">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mediumBlue" />
					</div>
				) : error ? (
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
						<p>{error}</p>
					</div>
				) : (
					<div>
						<div className="mb-8">
							<button
								onClick={handleBack}
								className="inline-flex items-center text-mediumBlue hover:text-darkBlue mb-4 transition-colors duration-200">
								<svg
									className="w-5 h-5 mr-1"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M10 19l-7-7m0 0l7-7m-7 7h18"
									/>
								</svg>
								Back to Surveys
							</button>

							<h1 className="text-3xl font-bold text-darkBlue mb-3">
								{surveyData?.title || "Loading..."}
							</h1>
							<p className="text-darkBlue/80 max-w-3xl">
								{surveyData?.description || "Loading..."}
							</p>

							<h2 className="text-2xl font-bold text-darkBlue mt-8 mb-4">Survey Questions</h2>
							
							<div className="grid gap-6 mb-10">
								{questions.length > 0 ? (
									questions.map((question) => (
										<div key={question.question_id} className="bg-white p-6 rounded-lg shadow-md">
											<div className="flex items-center mb-4">
												<span className="bg-lightBlue/50 text-darkBlue text-xs font-medium py-1 px-2 rounded">
													{question.category ? question.category.replace(/_/g, " ") : "Uncategorized"}
												</span>
											</div>
											<h3 className="text-xl font-semibold text-darkBlue mb-2">{question.title}</h3>
											<p className="text-gray-600 mb-2">
												{question.description || "No description provided."}
											</p>
										</div>
									))
								) : (
									<div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
										<p>This survey has no questions yet. Add some questions to get started.</p>
									</div>
								)}
							</div>
						</div>

						<div className="flex justify-center mt-10 space-x-4">
							<button
								onClick={handleViewAnswers}
								className="bg-mediumBlue hover:bg-hoverBlue text-white font-medium py-3 px-8 rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
							>
								<Eye className="w-5 h-5 mr-4" />
								VIEW ANSWERS
							</button>

							<button
								onClick={() => navigate(`update-survey`)}
								className="bg-darkBlue hover:bg-hoverBlue text-white font-medium py-3 px-8 rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
							>
								<Save className="w-5 h-5 mr-4" />
								EDIT SURVEY
							</button>
						</div>
					</div>
				)}
			</main>
			<Footer />
		</div>
	);
}

Survey.propTypes = {
	currentUser: PropTypes.shape({
		id: PropTypes.string,
		name: PropTypes.string,
		email: PropTypes.string
	})
};

export default Survey;