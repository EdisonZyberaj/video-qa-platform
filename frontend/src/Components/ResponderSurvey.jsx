import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

function ResponderSurvey() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [surveyData, setSurveyData] = useState(null);
	const [questions, setQuestions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(
		() => {
			const fetchSurveyDetails = async () => {
				try {
					const token = sessionStorage.getItem("token");
					if (!token) {
						navigate("/login");
						return;
					}
					const config = {
						headers: {
							Authorization: `Bearer ${token}`
						}
					};
					const surveyResponse = await axios.get(
						`http://localhost:5000/api/surveys/${id}`,
						config
					);

					const questionsResponse = await axios.get(
						`http://localhost:5000/api/surveys/${id}/questions`,
						config
					);

					setSurveyData(surveyResponse.data);
					setQuestions(questionsResponse.data);
					setLoading(false);
				} catch (err) {
					console.error("Error fetching survey details:", err);
					setError("An error occurred while fetching survey details");
					setLoading(false);
					if (
						err.response &&
						(err.response.status === 401 || err.response.status === 403)
					) {
						navigate("/login");
					}
				}
			};

			fetchSurveyDetails();
		},
		[id, navigate]
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
					: error
						? <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
								<p>
									{error}
								</p>
							</div>
						: <div>
								<h1 className="text-3xl font-bold text-darkBlue mb-4">
									{surveyData.title}
								</h1>
								<p className="text-darkBlue/80 mb-6">
									{surveyData.description}
								</p>
								<div className="grid gap-6">
									{questions.length > 0
										? questions.map(q =>
												<div
													key={q.question_id}
													className="bg-white p-6 rounded-lg shadow-md">
													<h3 className="text-lg font-semibold text-darkBlue">
														{q.title}
													</h3>
													<p className="text-sm text-gray-600 mt-2">
														Category: {q.category.replace(/_/g, " ")}
													</p>
													<button
														onClick={() => handleRespond(q.question_id)}
														className="mt-4 bg-softBlue hover:bg-hoverBlue text-white font-medium py-2 px-6 rounded-lg shadow-md transition-all duration-300">
														Respond
													</button>
												</div>
											)
										: <p className="text-center text-gray-500">
												No questions available for this survey
											</p>}
								</div>
							</div>}
			</main>
			<Footer />
		</div>
	);
}

export default ResponderSurvey;
