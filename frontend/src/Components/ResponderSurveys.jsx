import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Search, X } from "lucide-react";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

function ResponderSurveys() {
	const [surveys, setSurveys] = useState([]);
	const [loading, setLoading] = useState(true);
	const [authors, setAuthors] = useState({});
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		const fetchSurveys = async () => {
			try {
				const token = sessionStorage.getItem("token");

				const response = await axios.get(
					"http://localhost:5000/api/surveys/get-all-surveys",
					{
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json"
						}
					}
				);
				const data = response.data;
				setSurveys(data);

				const authorIds = [...new Set(data.map(survey => survey.authorId))];
				fetchAuthors(authorIds);
			} catch (error) {
				console.error("Error fetching surveys:", error);
			} finally {
				setLoading(false);
			}
		};

		const fetchAuthors = async authorIds => {
			try {
				const response = await axios.post(
					"http://localhost:5000/api/user/get-by-ids",
					{
						userIds: authorIds
					}
				);

				const authorsData = response.data;
				const authorsMap = {};

				authorsData.forEach(author => {
					authorsMap[author.user_id] = `${author.name} ${author.last_name}`;
				});

				setAuthors(authorsMap);
			} catch (error) {
				console.error("Error fetching authors:", error);
				const authorsMap = {};
				authorIds.forEach(id => {
					authorsMap[id] = `Author ${id}`;
				});
				setAuthors(authorsMap);
			}
		};

		fetchSurveys();
	}, []);

	const filteredSurveys = surveys.filter(survey => {
		const searchLower = searchTerm.toLowerCase();
		return (
			survey.title.toLowerCase().includes(searchLower) ||
			survey.description.toLowerCase().includes(searchLower) ||
			(authors[survey.authorId] || `Author ${survey.authorId}`)
				.toLowerCase()
				.includes(searchLower)
		);
	});

	return (
		<div className="flex flex-col min-h-screen">
			<Navbar />

			<main className="container mx-auto flex-grow py-12 px-10">
				<div className="mb-10 text-center">
					<h2 className="text-3xl font-bold text-darkBlue mb-3">
						Available Surveys
					</h2>
					<div className="h-1 w-20 bg-mediumBlue mx-auto mb-6" />
					<p className="text-darkBlue max-w-2xl mx-auto">
						Explore all surveys created by authors. Select a survey to view its
						details and participate.
					</p>
				</div>

				<div className="mb-8 max-w-md mx-auto">
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Search className="h-5 w-5 text-gray-400" />
						</div>
						<input
							type="text"
							placeholder="Search by title, description or author..."
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
					? <div className="flex justify-center items-center h-64">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mediumBlue" />
						</div>
					: <div>
							{filteredSurveys.length > 0
								? <div className="grid gap-6 md:grid-cols-2">
										{filteredSurveys.map(survey =>
											<Link
												key={survey.survey_id}
												to={`/responder-survey/${survey.survey_id}`}
												className="block bg-white rounded-xl shadow-lg hover:shadow-xl overflow-hidden border border-lightBlue transition-all duration-300">
												<div className="bg-mediumBlue h-3" />
												<div className="p-8">
													<span className="text-xl font-semibold text-darkBlue">
														{survey.title}
													</span>
													<p className="text-gray-600 mt-2 mb-2 line-clamp-2">
														{survey.description}
													</p>
													<p className="text-sm text-softBlue">
														Created by:{" "}
														<span className="font-medium">
															{authors[survey.authorId] ||
																`Author ${survey.authorId}`}
														</span>
													</p>
													<div className="flex justify-between items-center mt-4">
														<span className="text-base text-softBlue">
															{survey.questions.length} question{survey.questions.length !== 1 ? "s" : ""}
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
						</div>}
			</main>

			<Footer />
		</div>
	);
}

export default ResponderSurveys;
