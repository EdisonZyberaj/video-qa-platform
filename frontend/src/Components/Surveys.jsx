import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import SurveyImg from "../assets/surveyimg.png";
import { PlusCircle } from "lucide-react";

function Surveys({ currentUser }) {
	const [surveys, setSurveys] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// merr te dhena reale nga backendi
		const fetchSurveys = async () => {
			try {
				const mockSurveys = [
					{ id: 1, title: "Employee Satisfaction Survey" },
					{ id: 2, title: "Product Feedback Survey" },
					{ id: 3, title: "Work Environment Survey" },
					{ id: 4, title: "Career Development Survey" },
					{ id: 5, title: "Work Environment Survey" },
					{ id: 6, title: "Career Development Survey" }
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
					<h2 className="text-3xl font-bold text-darkBlue mb-3">My Surveys</h2>
					<div className="h-1 w-20 bg-mediumBlue mx-auto mb-6" />
					<p className="text-darkBlue max-w-2xl mx-auto">
						Select a survey to view its details and questions. Your
						participation helps us improve our services.
					</p>
				</div>

				{loading
					? <div className="flex justify-center items-center " />
					: <div>
							{surveys.length > 0
								? <div className="grid gap-6 md:grid-cols-2">
										{surveys.map(survey =>
											<Link
												key={survey.id}
												to={`/surveys/${survey.id}`}
												className="block bg-white rounded-lg shadow-lg hover:shadow-xl overflow-hidden border border-lightBlue">
												<div className="bg-mediumBlue h-3" />
												<div className="p-8">
													<span className="text-xl font-semibold text-darkBlue">
														{survey.title}
													</span>
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

Surveys.propTypes = {
	currentUser: PropTypes.shape({
		id: PropTypes.string,
		name: PropTypes.string,
		email: PropTypes.string
	})
};

export default Surveys;
