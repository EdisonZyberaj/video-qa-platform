import React from "react";
import PropTypes from "prop-types";

function Question({
	user,
	question,
	questionType,
	questionVideo,
	answer,
	answerUser,
	answerType,
	answerVideo,
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
				<div className="w-full lg:w-1/2 bg-white p-4 rounded-md shadow">
					{questionType === "text"
						? <h2 className="text-lg font-semibold text-gray-800">
								{question}
							</h2>
						: <video controls className="w-full h-auto">
								<source src={questionVideo} type="video/mp4" />
								Your browser does not support the video tag.
							</video>}
				</div>
				<div className="w-full lg:w-1/2 flex justify-center items-center mt-4 lg:mt-0" />
			</div>
			{hoveredId &&
				<div className="mt-4 p-4 bg-#F5F5F5 text-black rounded-lg">
					<div className="flex items-center mb-2">
						<div className="w-10 h-10 bg-#9AA6B2 rounded-full mr-2" />
						<p className="text-sm font-semibold">
							{answerUser}
						</p>
					</div>
					<div className="flex flex-col lg:flex-row">
						<div className="w-full lg:w-1/2 bg-#9AA6B2 p-4 rounded-md shadow-md">
							{answerType === "text"
								? <p>
										{answer}
									</p>
								: <video controls className="w-full h-auto">
										<source src={answerVideo} type="video/mp4" />
										Your browser does not support the video tag.
									</video>}
						</div>
						<div className="w-full lg:w-1/2 flex justify-center items-center mt-4 lg:mt-0">
							<p className="text-indigo-200">Video Answer</p>
						</div>
					</div>
				</div>}
		</div>
	);
}

Question.propTypes = {
	user: PropTypes.string.isRequired,
	question: PropTypes.string.isRequired,
	questionType: PropTypes.string.isRequired,
	questionVideo: PropTypes.string,
	answer: PropTypes.string.isRequired,
	answerUser: PropTypes.string.isRequired,
	answerType: PropTypes.string.isRequired,
	answerVideo: PropTypes.string,
	hoveredId: PropTypes.bool.isRequired,
	setHoveredId: PropTypes.func.isRequired
};

export default Question;
