import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

function AnswerQuestion() {
	const { id, questionId } = useParams();
	const navigate = useNavigate();
	const [answer, setAnswer] = useState("");

	const handleSubmit = () => {
		// jo data reale nga databza akoma
		console.log(
			`Survey ID: ${id}, Question ID: ${questionId}, Answer: ${answer}`
		);
		navigate(`/survey/${id}`);
	};

	return (
		<div className="flex flex-col min-h-screen bg-gradient-to-b from-lightBlue/30 to-lightBlue/50">
			<Navbar />
			<main className="container mx-auto flex-grow py-12 px-4 max-w-3xl">
				<h1 className="text-2xl font-bold text-darkBlue mb-6">
					Answer Question
				</h1>
				<textarea
					value={answer}
					onChange={e => setAnswer(e.target.value)}
					placeholder="Type your answer here..."
					className="w-full h-40 p-4 border border-lightBlue rounded-lg focus:outline-none focus:ring-2 focus:ring-mediumBlue"
				/>
				<button
					onClick={handleSubmit}
					className="bg-mediumBlue hover:bg-hoverBlue text-white font-medium py-3 px-8 rounded-full shadow-md hover:shadow-lg transition-all duration-300 mt-6">
					Submit Answer
				</button>
			</main>
			<Footer />
		</div>
	);
}

export default AnswerQuestion;
