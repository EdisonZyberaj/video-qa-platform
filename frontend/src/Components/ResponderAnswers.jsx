import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import axios from "axios";
import { Play, ArrowLeft } from 'lucide-react';

function ResponderAnswers() {
	const { id, responderId } = useParams();
	console.log(id,responderId);
	const navigate = useNavigate();
	const [responder, setResponder] = useState(null);
	const [answers, setAnswers] = useState([]);
	const [videoData, setVideoData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchResponderAnswers = async () => {
			try {
				const token = sessionStorage.getItem("token");

				if (!token) {
					throw new Error("Authentication token not found");
				}

				const config = {
					headers: {
						Authorization: `Bearer ${token}`
					}
				};

				console.log("Fetching data for survey:", id, "and responder:", responderId);

				const responderResponse = await axios.post(
					`http://localhost:5000/api/user/get-by-ids`,
					{
						userIds: [parseInt(responderId)]
					},
					config
				);

				if (!responderResponse.data || responderResponse.data.length === 0) {
					throw new Error("Responder not found");
				}

				const responderData = responderResponse.data[0];
				console.log("Responder data:", responderData);

				let answersData = [];
				try {
					console.log("Fetching answers from:", `/api/answers/survey/${id}/responder/${responderId}`);
					const answersResponse = await axios.get(
						`http://localhost:5000/api/answers/survey/${id}/responder/${responderId}`,
						config
					);
					answersData = answersResponse.data;
					console.log("Answers data:", answersData);
				} catch (answersError) {
					console.error("Error fetching answers:", answersError);
				}

				try {
					console.log("Fetching video from:", `/api/answers/survey/${id}/video/${responderId}`);
					const videoResponse = await axios.get(
						`http://localhost:5000/api/answers/survey/${id}/video/${responderId}`,
						config
					);

					if (videoResponse.data) {
						setVideoData(videoResponse.data);
						console.log("Video data:", videoResponse.data);
					}
				} catch (videoError) {
					console.log("No video found or error fetching video:", videoError.response?.status);
				}
				
				const answerDates = answersData.map(
					answer => new Date(answer.created_at)
				);
				const latestDate =
					answerDates.length > 0 ? new Date(Math.max(...answerDates)) : null;

				setResponder({
					...responderData,
					response_date: latestDate ? latestDate.toISOString() : null
				});
				setAnswers(answersData);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching responder answers:", error);
				setError(error.message || "Failed to load data");
				setLoading(false);
			}
		};

		fetchResponderAnswers();
	}, [id, responderId]);

	const handleBackToResponders = () => {
		navigate(`/survey/${id}/responders`);
	};

	const formatDate = dateString => {
		if (!dateString) return "Unknown date";
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
		if (!category) return "Uncategorized";
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

	if (error) {
		return (
			<div className="flex flex-col min-h-screen bg-gradient-to-b from-lightBlue/30 to-lightBlue/50">
				<Navbar />
				<main className="container mx-auto flex-grow py-12 px-4 max-w-5xl">
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
						<strong className="font-bold">Error: </strong>
						<span className="block sm:inline">
							{error}
						</span>
					</div>
					<button
						onClick={handleBackToResponders}
						className="bg-mediumBlue hover:bg-hoverBlue text-white font-medium py-2 px-6 rounded-md transition-colors duration-200">
						Back to All Responders
					</button>
				</main>
				<Footer />
			</div>
		);
	}

	if (!responder) {
		return (
			<div className="flex flex-col min-h-screen bg-gradient-to-b from-lightBlue/30 to-lightBlue/50">
				<Navbar />
				<main className="container mx-auto flex-grow py-12 px-4 max-w-5xl">
					<div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-6">
						<strong className="font-bold">Not Found: </strong>
						<span className="block sm:inline">
							Responder information could not be loaded.
						</span>
					</div>
					<button
						onClick={handleBackToResponders}
						className="bg-mediumBlue hover:bg-hoverBlue text-white font-medium py-2 px-6 rounded-md transition-colors duration-200">
						Back to All Responders
					</button>
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
						<ArrowLeft className="w-5 h-5 mr-1" />
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
								{responder.response_date &&
									<p className="text-white/80">
										Responses submitted on {formatDate(responder.response_date)}
									</p>}
							</div>
						</div>
					</div>
				</div>

				<h2 className="text-2xl font-bold text-darkBlue mb-6">
					Answers ({answers.length})
				</h2>

				{answers.length === 0 ? (
					<div className="bg-white rounded-xl shadow-md overflow-hidden p-6 mb-10">
						<p className="text-darkBlue/80">
							No answers submitted by this responder yet.</p>
					</div>
				) : (
					<div className="space-y-6 mb-10">
						{answers.map(answer => (
							<div
								key={answer.answer_id || `answer-${answer.questionId}`}
								className="bg-white rounded-xl shadow-md overflow-hidden">
								<div className="border-b border-lightBlue/30 bg-lightBlue/20 px-6 py-4">
									<div className="flex items-center justify-between">
										<h3 className="font-medium text-darkBlue">
											{answer.question?.title || "Question"}
										</h3>
										<span className="px-3 py-1 bg-lightBlue/30 text-darkBlue rounded-full text-xs font-medium">
											{getCategoryDisplayName(answer.question?.category)}
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
						))}
					</div>
				)}

				{videoData && (
					<div className="mb-10">
						<h2 className="text-2xl font-bold text-darkBlue mb-4">
							Video Response
						</h2>
						<div className="bg-white rounded-xl shadow-md overflow-hidden">
							<div className="bg-gray-900 p-6">
								<div className="flex items-center justify-center text-white">
									<div className="text-center">
										<Play className="w-7 h-7 mx-auto mb-3" />
										<p className="mb-3">
											Video response from {responder.name} {responder.last_name}
										</p>
										<a 
											href={videoData.question_link} 
											target="_blank" 
											rel="noopener noreferrer"
											className="bg-mediumBlue hover:bg-hoverBlue text-white font-medium py-2 px-6 rounded-md transition-colors duration-200 inline-block"
										>
											View Video
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
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