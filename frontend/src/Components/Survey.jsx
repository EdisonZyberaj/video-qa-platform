import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import QuestionCard from "./QuestionCard.jsx";
import { Eye, Save } from "lucide-react";
import axios from "axios";

function Survey() {
	const { id } = useParams();
	console.log(id);
	const navigate = useNavigate();
	const [surveyData, setSurveyData] = useState(null);
	const [questions, setQuestions] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchSurveyDetails = async () => {
			try {
			
				const token = sessionStorage.getItem("token");

				if (!token) {
					console.error("No token found. Redirecting to login.");
					navigate("/login");
					return;
				}

				const response = await axios.get(`http://localhost:5000/api/surveys/${id}`, {
					headers: {
						Authorization: `Bearer ${token}`, 
					},
				});

				const survey = response.data;

				setSurveyData({
					id: survey.survey_id,
					title: survey.title,
					description: survey.description,
				});

				setQuestions(
					Array.isArray(survey.questions)
						? survey.questions.map((q) => ({
								id: q.question_id,
								user: "Unknown User",
								question: q.title,
							}))
						: []
				);

				setLoading(false);
			} catch (error) {
				console.error("Error fetching survey details:", error);
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
				{loading
					? <div className="flex justify-center items-center h-64">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mediumBlue" />
						</div>
					: <div>
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

								<div className="grid gap-6 mb-10">
									{questions.length > 0 ? (
										questions.map((q) => (
											<QuestionCard key={q.id} user={q.user} question={q.question} />
										))
									) : (
										<p>No questions available.</p>
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
						</div>}
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
