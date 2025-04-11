import React from "react";
import PropTypes from "prop-types";

function QuestionCard({ user, question }) {
	return (
		<div className="bg-white rounded-xl shadow-sm border border-lightBlue overflow-hidden">
			<div className="border-b border-lightBlue/50 bg-lightBlue/20 p-4">
				<div className="flex items-center">
					<div className="w-10 h-10 bg-mediumBlue rounded-full flex items-center justify-center text-white font-bold">
						{user.charAt(0)}
					</div>
					<div className="ml-3">
						<p className="text-sm font-medium text-darkBlue">
							{user}
						</p>
						<p className="text-xs text-softBlue">2h ago</p>
					</div>
				</div>
			</div>
			<div className="p-5">
				<h3 className="text-lg font-medium text-darkBlue mb-2">
					{question}
				</h3>
			</div>
		</div>
	);
}

QuestionCard.propTypes = {
	user: PropTypes.string.isRequired,
	question: PropTypes.string.isRequired
};

export default QuestionCard;
