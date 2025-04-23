import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

function ResponderAnswers({ currentUser }) {
	const { id, responderId } = useParams();
	const navigate = useNavigate();
	const [responder, setResponder] = useState(null);
	const [answers, setAnswers] = useState([]);
	const [videoData, setVideoData] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(
		() => {
			const fetchResponderAnswers = async () => {
				try {
					// const responderResponse = await fetch(`/api/users/${responderId}`);
					// const answersResponse = await fetch(`/api/surveys/${id}/responder/${responderId}/answers`);
					// const videoResponse = await fetch(`/api/surveys/${id}/responder/${responderId}/video`);

					const mockResponder = {
						user_id: parseInt(responderId),
						name: "Maria",
						last_name: "Garcia",
						email: "maria.garcia@example.com",
						role: "RESPONDER",
						created_at: "2025-01-15T09:45:00Z",
						response_date: "2025-04-07T12:45:00Z"
					};
					const mockAnswers = [
						{
							answer_Id: 101,
							questionId: 1,
							text:
								"I've found React hooks to be the most challenging aspect initially, especially managing complex state with useEffect. Custom hooks helped organize my code better, and understanding the dependency array was crucial for optimization.",
							created_at: "2025-04-07T12:30:00Z",
							question: {
								question_id: 1,
								title:
									"What challenges have you faced implementing React in your projects?",
								category: "WEB_DEVELOPMENT"
							}
						},
						{
							answer_Id: 102,
							questionId: 2,
							text:
								"Remote work has significantly improved my productivity by eliminating commute time and office distractions. I've established a dedicated workspace and set clear boundaries between work and personal time. The flexibility allows me to work during my most productive hours.",
							created_at: "2025-04-07T12:35:00Z",
							question: {
								question_id: 2,
								title:
									"How has remote work affected your productivity and work-life balance?",
								category: "CAREER_ADVICE"
							}
						},
						{
							answer_Id: 103,
							questionId: 3,
							text:
								"I would benefit most from mentorship opportunities with senior designers and access to advanced UX research tools. Regular feedback sessions with stakeholders would also help me understand the business impact of my designs better.",
							created_at: "2025-04-07T12:40:00Z",
							question: {
								question_id: 3,
								title:
									"What resources would help you advance your career at our company?",
								category: "CAREER_ADVICE"
							}
						}
					];
					const mockVideoData = {
						servey_video_id: 25,
						question_link:
							"https://storage.example.com/videos/survey123/maria_garcia_response.mp4",
						surveyId: parseInt(id),
						uploaderId: parseInt(responderId)
					};

					setResponder(mockResponder);
					setAnswers(mockAnswers);
					setVideoData(mockVideoData);
					setLoading(false);
				} catch (error) {
					console.error("Error fetching responder answers:", error);
					setLoading(false);
				}
			};

			fetchResponderAnswers();
		},
		[id, responderId]
	);

	const handleBackToResponders = () => {
		navigate(`/survey/${id}/responders`);
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

	const getCategoryDisplayName = category => {
		return category
			.replace(/_/g, " ")
			.toLowerCase()
			.split(" ")
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
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
						onClick={handleBackToResponders}
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
						Back to All Responders
					</button>
				</div>

				<div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
					<div className="bg-mediumBlue/80 px-6 py-8">
						<div className="flex items-center">
							<div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-mediumBlue font-bold text-xl">
								{responder.name.charAt(0)}
								{responder.last_name.charAt(0)}
							</div>
							<div className="ml-5">
								<h1 className="text-2xl font-bold text-white">
									{responder.name} {responder.last_name}
								</h1>
								<p className="text-white/80">
									Responses submitted on {formatDate(responder.response_date)}
								</p>
							</div>
						</div>
					</div>
				</div>

				<h2 className="text-2xl font-bold text-darkBlue mb-6">
					Answers ({answers.length})
				</h2>

				<div className="space-y-6 mb-10">
					{answers.map(answer =>
						<div
							key={answer.answer_Id}
							className="bg-white rounded-xl shadow-md overflow-hidden">
							<div className="border-b border-lightBlue/30 bg-lightBlue/20 px-6 py-4">
								<div className="flex items-center justify-between">
									<h3 className="font-medium text-darkBlue">
										{answer.question.title}
									</h3>
									<span className="px-3 py-1 bg-lightBlue/30 text-darkBlue rounded-full text-xs font-medium">
										{getCategoryDisplayName(answer.question.category)}
									</span>
								</div>
							</div>
							<div className="px-6 py-5">
								<p className="text-darkBlue/80 whitespace-pre-line">
									{answer.text}
								</p>
								<p className="text-xs text-softBlue mt-4">
									Answered on {formatDate(answer.created_at)}
								</p>
							</div>
						</div>
					)}
				</div>

				{videoData &&
					<div className="mb-10">
						<h2 className="text-2xl font-bold text-darkBlue mb-4">
							Video Response
						</h2>
						<div className="bg-white rounded-xl shadow-md overflow-hidden">
							<div className="aspect-w-16 aspect-h-9 bg-gray-900">
								<div className="flex items-center justify-center h-64 text-white">
									<div className="text-center">
										<svg
											className="w-16 h-16 mx-auto mb-3"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
											/>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										<p className="mb-3">
											Video response from {responder.name} {responder.last_name}
										</p>
										<button className="bg-mediumBlue hover:bg-hoverBlue text-white font-medium py-2 px-6 rounded-md transition-colors duration-200">
											Play Video
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>}
			</main>
			<Footer />
		</div>
	);
}

ResponderAnswers.propTypes = {
	currentUser: PropTypes.shape({
		user_id: PropTypes.number,
		name: PropTypes.string,
		last_name: PropTypes.string,
		email: PropTypes.string,
		role: PropTypes.string
	})
};

export default ResponderAnswers;
