import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import { PlusCircle, Search, X } from "lucide-react";

function Surveys() {
	const [surveys, setSurveys] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		const fetchSurveys = async () => {
			try {
				setLoading(true);

				const token = sessionStorage.getItem("token");

				if (!token) {
					throw new Error("Authentication token not found");
				}

				const response = await axios.get(
					"http://localhost:5000/api/surveys/my-surveys",
					{
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json"
						}
					}
				);

				setSurveys(response.data);
				setError(null);
			} catch (error) {
				console.error("Error fetching surveys:", error);
				setError("Failed to load surveys. Please try again later.");
			} finally {
				setLoading(false);
			}
		};

		fetchSurveys();
	}, []);
	const filteredSurveys = surveys.filter(survey => {
		const searchLower = searchTerm.toLowerCase();
		return (
			survey.title.toLowerCase().includes(searchLower) ||
			survey.description.toLowerCase().includes(searchLower)
		);
	});

	return (
		<div className="flex flex-col min-h-screen">
			<Navbar />

			<main className="container mx-auto flex-grow py-12 px-10">
				<div className="mb-10 text-center">
					<h2 className="text-3xl font-bold text-darkBlue mb-3">My Surveys</h2>
					<div className="h-1 w-20 bg-mediumBlue mx-auto mb-6" />
					<p className="text-darkBlue max-w-2xl mx-auto">
						Select a survey to view its details and questions. Your
						participation helps us improve our services.
					</p>
				</div>
				<div className="mb-8 max-w-md mx-auto">
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Search className="h-5 w-5 text-gray-400" />
						</div>
						<input
							type="text"
							placeholder="Search surveys..."
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
							className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-mediumBlue focus:border-mediumBlue"
						/>
						{searchTerm &&
							<button
								onClick={() => setSearchTerm("")}
								className="absolute inset-y-0 right-0 pr-3 flex items-center">
								<X className="h-4 w-4 text-gray-400" />
							</button>}
					</div>
				</div>

				{loading
					? <div className="flex justify-center items-center">
							<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mediumBlue" />
						</div>
					: error
						? <div className="text-center py-8 bg-white rounded-xl shadow">
								<p className="text-red-500">
									{error}
								</p>
								<button
									onClick={() => window.location.reload()}
									className="mt-4 bg-mediumBlue hover:bg-hoverBlue text-white font-medium py-2 px-4 rounded">
									Try Again
								</button>
							</div>
						: <div>
								{filteredSurveys.length > 0
									? <div className="grid gap-6 md:grid-cols-2">
											{filteredSurveys.map(survey =>
												<Link
													key={survey.survey_id}
													to={`/surveys/${survey.survey_id}`}
													className="block bg-white rounded-xl shadow-lg hover:shadow-xl overflow-hidden border border-lightBlue transition-all duration-300">
													<div className="bg-mediumBlue h-3" />
													<div className="p-8">
														<span className="text-xl font-semibold text-darkBlue">
															{survey.title}
														</span>
														<p className="text-gray-600 mt-2 mb-4 line-clamp-2">
															{survey.description}
														</p>
														<div className="flex justify-between items-center mt-6">
															<span className="text-base text-softBlue">
																{survey.questions
																	? survey.questions.length
																	: 0}{" "}
																questions
															</span>
															<span className="text-base font-medium text-mediumBlue">
																View details →
															</span>
														</div>
													</div>
												</Link>
											)}
										</div>
									: <div className="text-center py-16 bg-white rounded-xl shadow">
											{searchTerm
												? <p className="text-darkBlue/70">
														No surveys matching "{searchTerm}" found.
													</p>
												: <p className="text-darkBlue/70">
														No surveys available at the moment.
													</p>}
										</div>}

								<div className="flex justify-center mt-10">
									<Link
										to="/add-survey"
										className="bg-mediumBlue hover:bg-hoverBlue text-white font-medium py-3 px-8 rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center">
										<PlusCircle className="w-4 h-4 mr-4" />
										ADD SURVEY
									</Link>
								</div>
							</div>}
			</main>

			<Footer />
		</div>
	);
}

export default Surveys;
