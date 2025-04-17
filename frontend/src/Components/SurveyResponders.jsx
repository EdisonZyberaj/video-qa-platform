import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
function SurveyResponders({ currentUser }) {
	const { id } = useParams();
	const navigate = useNavigate();
	const [survey, setSurvey] = useState(null);
	const [responders, setResponders] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(
		() => {
			const fetchSurveyResponders = async () => {
				try {
					// do perdor axios
					// const response = await fetch(`/api/surveys/${id}/responders`);
					// const data = await response.json();

					const mockSurvey = {
						survey_id: parseInt(id),
						title: `Survey ${id}`,
						description: "Survey description goes here",
						created_at: "2025-03-15T10:00:00Z",
						authorId: 1
					};

					const mockResponders = [
						{
							user_id: 2,
							name: "Alex",
							last_name: "Thompson",
							email: "alex.thompson@example.com",
							role: "RESPONDER",
							created_at: "2025-01-10T08:30:00Z",
							response_date: "2025-04-08T15:30:00Z",
							answers_count: 3
						},
						{
							user_id: 3,
							name: "Maria",
							last_name: "Garcia",
							email: "maria.garcia@example.com",
							role: "RESPONDER",
							created_at: "2025-01-15T09:45:00Z",
							response_date: "2025-04-07T12:45:00Z",
							answers_count: 3
						},
						{
							user_id: 4,
							name: "Robert",
							last_name: "Chen",
							email: "robert.chen@example.com",
							role: "RESPONDER",
							created_at: "2025-01-20T11:15:00Z",
							response_date: "2025-04-06T09:20:00Z",
							answers_count: 3
						},
						{
							user_id: 5,
							name: "Jasmine",
							last_name: "Williams",
							email: "jasmine.williams@example.com",
							role: "RESPONDER",
							created_at: "2025-01-25T14:30:00Z",
							response_date: "2025-04-05T16:10:00Z",
							answers_count: 3
						}
					];

					setSurvey(mockSurvey);
					setResponders(mockResponders);
					setLoading(false);
				} catch (error) {
					console.error("Error fetching survey responders:", error);
					setLoading(false);
				}
			};

			fetchSurveyResponders();
		},
		[id]
	);

	const handleBackToSurvey = () => {
		navigate(`/survey/${id}`);
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

				<div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
					<div className="bg-lightBlue/20 px-6 py-4 border-b border-lightBlue/30">
						<h2 className="text-xl font-semibold text-darkBlue">Responders</h2>
					</div>

					<ul className="divide-y divide-lightBlue/30">
						{responders.map(responder =>
							<li
								key={responder.user_id}
								className="hover:bg-lightBlue/10 transition-colors duration-200 cursor-pointer"
								onClick={() => handleViewResponderAnswers(responder.user_id)}>
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
											<span className="text-sm text-softBlue">Responded</span>
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
