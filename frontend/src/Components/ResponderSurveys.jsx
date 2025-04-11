import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import SurveyImg from "../assets/surveyimg.png";

function ResponderSurveys({ currentUser }) {
	const [surveys, setSurveys] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Fetch cdo survey nga databza
		const fetchSurveys = async () => {
			try {
				const mockSurveys = [
					{ id: 1, title: "Employee Satisfaction Survey", author: "John Doe" },
					{ id: 2, title: "Product Feedback Survey", author: "Jane Smith" },
					{ id: 3, title: "Work Environment Survey", author: "Alice Johnson" },
					{ id: 4, title: "Career Development Survey", author: "Bob Brown" },
					{
						id: 5,
						title: "Customer Satisfaction Survey",
						author: "Emily Davis"
					},
					{ id: 6, title: "Team Collaboration Survey", author: "Michael Lee" }
				];

				setSurveys(mockSurveys);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching surveys:", error);
				setLoading(false);
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
												key={survey.id}
												to={`/responder-survey/${survey.id}`}
												className="block bg-white rounded-lg shadow-lg hover:shadow-xl overflow-hidden border border-lightBlue">
												<div className="bg-mediumBlue h-3" />
												<div className="p-8">
													<span className="text-xl font-semibold text-darkBlue">
														{survey.title}
													</span>
													<p className="text-sm text-softBlue mt-2">
														Created by:{" "}
														<span className="font-medium">{survey.author}</span>
													</p>
													<div className="flex justify-between items-center mt-6">
														<span className="text-base text-softBlue">
															5 questions
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
