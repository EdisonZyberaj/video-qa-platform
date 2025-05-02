import React from "react";
import { Link } from "react-router-dom";

function QuestionCard({ question, isAnswered, surveyId }) {
	// Function to format category text (replace underscores with spaces and capitalize)
	const formatCategory = category => {
		// Check if category is undefined or null
		if (!category) {
			return "Uncategorized";
		}
		return category.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
	};

	return (
		<div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
			<div className="p-6">
				<h3 className="text-xl font-semibold text-darkBlue mb-2 line-clamp-2">
					{question.title}
				</h3>

				<div className="flex items-center mb-4">
					<span className="bg-lightBlue/50 text-darkBlue text-xs font-medium py-1 px-2 rounded">
						{formatCategory(question.category || "")}
					</span>

					{isAnswered
						? <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium py-1 px-2 rounded">
								Answered
							</span>
						: <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium py-1 px-2 rounded">
								Needs Answer
							</span>}
				</div>

				<p className="text-gray-600 mb-6 line-clamp-3">
					{question.description || "No description provided."}
				</p>

				<div className="flex justify-end">
					{isAnswered
						? <button
								disabled
								className="bg-gray-300 text-gray-700 py-2 px-4 rounded-full">
								Already Answered
							</button>
						: <Link
								to={`/survey/${surveyId}/question/${question.question_id}/answer`}
								className="bg-mediumBlue hover:bg-hoverBlue text-white py-2 px-4 rounded-full transition-colors duration-200">
								Answer Question
							</Link>}
				</div>
			</div>
		</div>
	);
}

export default QuestionCard;
