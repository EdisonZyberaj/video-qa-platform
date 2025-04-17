import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

function ResponderSurveys() {
	const [surveys, setSurveys] = useState([]);
	const [loading, setLoading] = useState(true);
	const [authors, setAuthors] = useState({});

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

	return (
		<div className="flex flex-col min-h-screen">
			<Navbar />

			<main className="container mx-auto flex-grow py-12 px-6">
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

				{loading
					? <div className="flex justify-center items-center h-64">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mediumBlue" />
						</div>
					: <div>
							{surveys.length > 0
								? <div className="grid gap-6 md:grid-cols-2">
										{surveys.map(survey =>
											<Link
												key={survey.survey_id}
												to={`/responder-survey/${survey.survey_id}`}
												className="block bg-white rounded-lg shadow-lg hover:shadow-xl overflow-hidden border border-lightBlue">
												<div className="bg-mediumBlue h-3" />
												<div className="p-8">
													<span className="text-xl font-semibold text-darkBlue">
														{survey.title}
													</span>
													<p className="text-sm text-softBlue mt-2">
														Created by:{" "}
														<span className="font-medium">
															{authors[survey.authorId] ||
																`Author ${survey.authorId}`}
														</span>
													</p>
													<div className="flex justify-between items-center mt-6">
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
										<p className="text-darkBlue/70">
											No surveys available at the moment.
										</p>
									</div>}
						</div>}
			</main>

			<Footer />
		</div>
	);
}

ResponderSurveys.propTypes = {
	currentUser: PropTypes.shape({
		id: PropTypes.string,
		name: PropTypes.string,
		email: PropTypes.string
	})
};

export default ResponderSurveys;
