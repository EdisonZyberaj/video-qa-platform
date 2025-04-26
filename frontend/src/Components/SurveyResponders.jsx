import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import axios from "axios";

function SurveyResponders({ currentUser }) {
	const { id } = useParams();
	const navigate = useNavigate();
	const [survey, setSurvey] = useState(null);
	const [responders, setResponders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(
		() => {
			const fetchSurveyResponders = async () => {
				try {
					// Check if token exists
					const token = sessionStorage.getItem("token");
					console.log("Token exists:", !!token);

					if (!token) {
						setError("Authentication token not found. Please log in again.");
						setLoading(false);
						return;
					}

					console.log("Fetching survey data for ID:", id);
					const response = await axios.get(
						`http://localhost:5000/api/surveys/${id}/responders`,
						{
							headers: {
								Authorization: `Bearer ${token}`
							}
						}
					);

					console.log("Survey data received:", response.data);
					setSurvey(response.data.survey);
					setResponders(response.data.responders);
					setLoading(false);
				} catch (error) {
					console.error("Error fetching survey responders:", error);
					// More detailed error logging
					if (error.response) {
						console.error("Response error data:", error.response.data);
						console.error("Response error status:", error.response.status);
					}
					setError(`Failed to fetch survey responders: ${error.message}`);
					setLoading(false);
				}
			};

			fetchSurveyResponders();
		},
		[id]
	);

	const handleBackToSurvey = () => {
		navigate(`/surveys/${id}`);
	};

	const handleViewResponderAnswers = responderId => {
		navigate(`/survey/${id}/responder/${responderId}`);
	};

	const formatDate = dateString => {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit"
		}).format(date);
	};

	const getInitials = (firstName, lastName) => {
		return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
	};

	if (loading) {
		return (
			<div className="flex flex-col min-h-screen bg-gradient-to-b from-lightBlue/30 to-lightBlue/50">
				<Navbar />
				<main className="container mx-auto flex-grow py-12 px-4 max-w-5xl">
					<div className="flex justify-center items-center h-64">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mediumBlue" />
					</div>
				</main>
				<Footer />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col min-h-screen bg-gradient-to-b from-lightBlue/30 to-lightBlue/50">
				<Navbar />
				<main className="container mx-auto flex-grow py-12 px-4 max-w-5xl">
					<div
						className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
						role="alert">
						<strong className="font-bold">Error: </strong>
						<span className="block sm:inline">
							{error}
						</span>
						<button
							className="mt-4 bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded"
							onClick={handleBackToSurvey}>
							Go Back to Survey
						</button>
					</div>
				</main>
				<Footer />
			</div>
		);
	}

	if (!survey) {
		return (
			<div className="flex flex-col min-h-screen bg-gradient-to-b from-lightBlue/30 to-lightBlue/50">
				<Navbar />
				<main className="container mx-auto flex-grow py-12 px-4 max-w-5xl">
					<div
						className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative"
						role="alert">
						<strong className="font-bold">Notice: </strong>
						<span className="block sm:inline">
							Survey not found or you don't have permission to view it.
						</span>
						<button
							className="mt-4 bg-mediumBlue hover:bg-darkBlue text-white font-bold py-2 px-4 rounded"
							onClick={() => navigate("/")}>
							Return to Home
						</button>
					</div>
				</main>
				<Footer />
			</div>
		);
	}

	return (
		<div className="flex flex-col min-h-screen bg-gradient-to-b from-lightBlue/30 to-lightBlue/50">
			<Navbar />
			<main className="container mx-auto flex-grow py-12 px-4 max-w-5xl">
				<div className="mb-8">
					<button
						onClick={handleBackToSurvey}
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
						Back to Survey
					</button>

					<h1 className="text-3xl font-bold text-darkBlue mb-3">
						{survey.title} Responses
					</h1>
					<div className="h-1 w-20 bg-mediumBlue mb-4" />
					<p className="text-darkBlue/80 mb-6">
						{responders.length}{" "}
						{responders.length === 1 ? "person has" : "people have"} responded
						to this survey.
					</p>
				</div>

				{responders.length > 0
					? <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
							<div className="bg-lightBlue/20 px-6 py-4 border-b border-lightBlue/30">
								<h2 className="text-xl font-semibold text-darkBlue">
									Responders
								</h2>
							</div>

							<ul className="divide-y divide-lightBlue/30">
								{responders.map(responder =>
									<li
										key={responder.user_id}
										className="hover:bg-lightBlue/10 transition-colors duration-200 cursor-pointer"
										onClick={() =>
											handleViewResponderAnswers(responder.user_id)}>
										<div className="px-6 py-5 flex items-center justify-between">
											<div className="flex items-center">
												<div className="w-12 h-12 bg-mediumBlue rounded-full flex items-center justify-center text-white font-bold">
													{getInitials(responder.name, responder.last_name)}
												</div>
												<div className="ml-4">
													<h3 className="text-lg font-medium text-darkBlue">
														{responder.name} {responder.last_name}
													</h3>
													<p className="text-sm text-softBlue">
														{responder.answers_count}{" "}
														{responder.answers_count === 1
															? "answer"
															: "answers"}{" "}
														submitted
													</p>
												</div>
											</div>
											<div className="flex items-center">
												<div className="mr-6 text-right">
													<span className="text-sm text-softBlue">
														Responded
													</span>
													<p className="text-sm font-medium text-darkBlue">
														{formatDate(responder.response_date)}
													</p>
												</div>
												<svg
													className="w-6 h-6 text-mediumBlue"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
													xmlns="http://www.w3.org/2000/svg">
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M9 5l7 7-7 7"
													/>
												</svg>
											</div>
										</div>
									</li>
								)}
							</ul>
						</div>
					: <div className="bg-white rounded-xl shadow-md p-8 text-center">
							<svg
								className="w-16 h-16 text-mediumBlue/60 mx-auto mb-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<h3 className="text-xl font-semibold text-darkBlue mb-2">
								No Responses Yet
							</h3>
							<p className="text-softBlue mb-6">
								This survey hasn't received any responses yet.
							</p>
							<button
								onClick={handleBackToSurvey}
								className="bg-mediumBlue hover:bg-darkBlue text-white px-4 py-2 rounded-lg transition-colors duration-200">
								View Survey Details
							</button>
						</div>}
			</main>
			<Footer />
		</div>
	);
}

SurveyResponders.propTypes = {
	currentUser: PropTypes.shape({
		user_id: PropTypes.number,
		name: PropTypes.string,
		last_name: PropTypes.string,
		email: PropTypes.string,
		role: PropTypes.string
	})
};

export default SurveyResponders;
