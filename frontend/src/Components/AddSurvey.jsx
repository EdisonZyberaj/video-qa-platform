import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import axios from "axios";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CATEGORIES = [
	"TECHNOLOGY",
	"PROGRAMMING",
	"WEB_DEVELOPMENT",
	"MOBILE_DEVELOPMENT",
	"DATA_SCIENCE",
	"ARTIFICIAL_INTELLIGENCE",
	"MACHINE_LEARNING",
	"CYBERSECURITY",
	"CLOUD_COMPUTING",
	"DEVOPS",
	"DATABASES",
	"BLOCKCHAIN",
	"HEALTH_AND_MEDICINE",
	"MENTAL_HEALTH",
	"PHYSICAL_FITNESS",
	"NUTRITION",
	"BUSINESS",
	"ENTREPRENEURSHIP",
	"MARKETING",
	"FINANCE",
	"INVESTING",
	"CAREER_ADVICE",
	"EDUCATION",
	"LANGUAGES",
	"MATHEMATICS",
	"SCIENCE",
	"PHYSICS",
	"CHEMISTRY",
	"BIOLOGY",
	"ASTRONOMY",
	"ENVIRONMENTAL_SCIENCE",
	"HISTORY",
	"POLITICS",
	"LAW",
	"PHILOSOPHY",
	"PSYCHOLOGY",
	"SOCIOLOGY",
	"ARTS_AND_CULTURE",
	"MUSIC",
	"LITERATURE",
	"FILM_AND_TELEVISION",
	"GAMING",
	"TRAVEL",
	"COOKING",
	"FASHION",
	"RELATIONSHIPS",
	"PARENTING",
	"HOME_IMPROVEMENT",
	"GARDENING",
	"PETS",
	"AUTOMOTIVE",
	"SPORTS",
	"DIY_AND_CRAFTS",
	"PHOTOGRAPHY"
];

function AddSurvey() {
	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [surveyData, setSurveyData] = useState({
		title: "",
		description: "",
		questions: [{ title: "", category: "TECHNOLOGY" }]
	});

	useEffect(
		() => {
			const token = sessionStorage.getItem("token");

			if (!token) {
				 toast.error("You are not authenticated"); 
				navigate("/login");
			}
		},
		[navigate]
	);

	const handleSurveyChange = e => {
		const { name, value } = e.target;
		setSurveyData({
			...surveyData,
			[name]: value
		});
	};

	const handleQuestionChange = (index, e) => {
		const { name, value } = e.target;

		const updatedQuestions = [...surveyData.questions];

		updatedQuestions[index] = {
			...updatedQuestions[index],
			[name]: value
		};

		setSurveyData({
			...surveyData,
			questions: updatedQuestions
		});
	};

	const addQuestion = () => {
		setSurveyData({
			...surveyData,
			questions: [
				...surveyData.questions,
				{ title: "", category: "TECHNOLOGY" }
			]
		});
	};

	const removeQuestion = index => {
		const updatedQuestions = [...surveyData.questions];
		updatedQuestions.splice(index, 1);

		setSurveyData({
			...surveyData,
			questions: updatedQuestions
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const token = sessionStorage.getItem("token");

			if (!token) {
				setError("You are not authenticated. Please log in.");
				navigate("/login");
				return;
			}
			const authorId = sessionStorage.getItem("user_id");

			const payload = {
				...surveyData,
				authorId: parseInt(authorId, 10) || null,
			};

			const response = await axios.post(
				"http://localhost:5000/api/surveys/add-survey",
				payload,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			
			if(!response){
					console.log("error");
				}
			toast.success("Survey created successfully!");

			setTimeout(() => {
				navigate("/surveys");
			}, 2000); 
		} catch (error) {
			console.error("Error creating survey:", error);
			const errorMessage =
				error.response?.data?.message ||
				error.message ||
				"An error occurred while creating the survey";

			toast.error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col min-h-screen">
			<Navbar />

			<main className="container mx-auto flex-grow py-12 px-6">
				<div className="mb-10 text-center">
					<h2 className="text-3xl font-bold text-darkBlue mb-3">
						Create New Survey
					</h2>
					<div className="h-1 w-20 bg-mediumBlue mx-auto mb-6" />
					<p className="text-darkBlue max-w-2xl mx-auto">
						Create a new survey by filling out the details below and adding
						questions.
					</p>
				</div>

				<form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
					<div className="bg-white shadow-lg rounded-lg p-8 mb-8">
						<h3 className="text-xl font-semibold text-darkBlue mb-6">
							Survey Details
						</h3>
						<div className="mb-6">
							<label
								htmlFor="title"
								className="block text-sm font-medium text-darkBlue mb-2">
								Survey Title *
							</label>
							<input
								type="text"
								id="title"
								name="title"
								value={surveyData.title}
								onChange={handleSurveyChange}
								className="w-full p-3 border border-lightBlue rounded-lg focus:outline-none focus:ring-2 focus:ring-mediumBlue"
								placeholder="Enter survey title"
								required
							/>
						</div>

						<div className="mb-2">
							<label
								htmlFor="description"
								className="block text-sm font-medium text-darkBlue mb-2">
								Description *
							</label>
							<textarea
								id="description"
								name="description"
								value={surveyData.description}
								onChange={handleSurveyChange}
								className="w-full p-3 border border-lightBlue rounded-lg focus:outline-none focus:ring-2 focus:ring-mediumBlue h-32"
								placeholder="Enter survey description"
								required
							/>
						</div>
					</div>

					<div className="bg-white shadow-lg rounded-lg p-8 mb-8">
						<div className="flex justify-between items-center mb-6">
							<h3 className="text-xl font-semibold text-darkBlue">
								Survey Questions
							</h3>
							<button
								type="button"
								onClick={addQuestion}
								className="flex items-center bg-mediumBlue hover:bg-hoverBlue text-white px-4 py-2 rounded-lg transition-colors">
								<Plus className="w-4 h-4 mr-2" />
								Add Question
							</button>
						</div>
						{surveyData.questions.map((question, index) =>
							<div
								key={index}
								className="bg-gray-50 p-6 rounded-lg mb-6 border border-lightBlue">
								<div className="flex justify-between items-center mb-4">
									<h4 className="font-medium text-darkBlue">
										Question {index + 1}
									</h4>
									{surveyData.questions.length > 1 &&
										<button
											type="button"
											onClick={() => removeQuestion(index)}
											className="text-red-500 hover:text-red-700 flex items-center">
											<Trash2 className="w-4 h-4 mr-1" />
											Remove
										</button>}
								</div>
								<div className="mb-4">
									<label
										htmlFor={`question-${index}`}
										className="block text-sm font-medium text-darkBlue mb-2">
										Question Text *
									</label>
									<input
										type="text"
										id={`question-${index}`}
										name="title"
										value={question.title}
										onChange={e => handleQuestionChange(index, e)}
										className="w-full p-3 border border-lightBlue rounded-lg focus:outline-none focus:ring-2 focus:ring-mediumBlue"
										placeholder="Enter question text"
										required
									/>
								</div>
								<div>
									<label
										htmlFor={`category-${index}`}
										className="block text-sm font-medium text-darkBlue mb-2">
										Category *
									</label>
									<select
										id={`category-${index}`}
										name="category"
										value={question.category}
										onChange={e => handleQuestionChange(index, e)}
										className="w-full p-3 border border-lightBlue rounded-lg focus:outline-none focus:ring-2 focus:ring-mediumBlue"
										required>
										{CATEGORIES.map(category =>
											<option key={category} value={category}>
												{category.replace(/_/g, " ")}
											</option>
										)}
									</select>
								</div>
							</div>
						)}
					</div>

					<div className="flex justify-center mt-8 mb-12">
						<button
							type="submit"
							disabled={loading}
							className="bg-mediumBlue hover:bg-hoverBlue text-white font-medium py-4 px-10 rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center text-lg disabled:opacity-70">
							{loading
								? "Creating..."
								: <div className="flex items-center">
										<Save className="w-5 h-5 mr-3" />
										Create Survey
									</div>}
						</button>
					</div>
				</form>
			</main>

			<Footer />

			<ToastContainer
				position="top-center"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop
				closeOnClicks
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
		</div>
	);
}

export default AddSurvey;
