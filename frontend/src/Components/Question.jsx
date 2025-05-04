import React from "react";
import PropTypes from "prop-types";
/// faqe e fillimit
function Question({
	user,
	question,
	answer,
	answerUser,
	hoveredId,
	setHoveredId
}) {
	return (
		<div
			onMouseEnter={() => setHoveredId(true)}
			onMouseLeave={() => setHoveredId(false)}
			className="p-4 border rounded-lg shadow-lg bg-gray-50 hover:bg-gray-200 transition duration-300 cursor-pointer">
			<div className="flex items-center mb-2">
				<div className="w-10 h-10 bg-blue-500 rounded-full mr-2" />
				<p className="text-sm font-semibold text-gray-700">
					{user}
				</p>
				<span className="ml-auto text-xs text-gray-500">2h ago</span>
			</div>
			<div className="flex flex-col lg:flex-row">
				<div className="w-full bg-white p-4 rounded-md shadow">
					<h2 className="text-lg font-semibold text-gray-800">
						{question}
					</h2>
				</div>
			</div>
			{hoveredId &&
				<div className="mt-4 p-4 bg-gray-100 text-black rounded-lg">
					<div className="flex items-center mb-2">
						<div className="w-10 h-10 bg-gray-400 rounded-full mr-2" />
						<p className="text-sm font-semibold">
							{answerUser}
						</p>
					</div>
					<div className="w-full bg-gray-200 p-4 rounded-md shadow-md">
						<p>
							{answer}
						</p>
					</div>
				</div>}
		</div>
	);
}

Question.propTypes = {
	user: PropTypes.string.isRequired,
	question: PropTypes.string.isRequired,
	answer: PropTypes.string.isRequired,
	answerUser: PropTypes.string.isRequired,
	hoveredId: PropTypes.bool.isRequired,
	setHoveredId: PropTypes.func.isRequired
};

export default Question;
