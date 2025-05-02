import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getSurveyById = async id => {
	try {
		const survey = await prisma.survey.findUnique({
			where: { survey_id: parseInt(id) },
			include: {
				author: {
					select: {
						name: true,
						last_name: true
					}
				},
				questions: {
					include: {
						author: {
							select: {
								name: true,
								last_name: true
							}
						}
					}
				}
			}
		});

		if (!survey) {
			throw new Error("Survey not found");
		}

		return survey;
	} catch (error) {
		console.error("Error fetching survey:", error);
		throw error;
	}
};
export const createSurveyWithQuestions = async ({
	title,
	description,
	authorId,
	questions
}) => {
	const survey = await prisma.survey.create({
		data: {
			title,
			description,
			created_at: new Date(),
			authorId,
			questions: {
				create: questions.map(question => ({
					title: question.title,
					category: question.category,
					authorId: authorId
				}))
			}
		},
		include: {
			questions: true
		}
	});

	return survey;
};
export const getAllSurveys = async () => {
	const surveys = await prisma.survey.findMany({
		include: {
			questions: true
		}
	});
	return surveys;
};

export const getSurveysByUserId = async userId => {
	try {
		const surveys = await prisma.survey.findMany({
			where: {
				authorId: parseInt(userId)
			},
			include: {
				questions: true,
				author: {
					select: {
						user_id: true,
						name: true,
						last_name: true,
						email: true,
						role: true
					}
				}
			},
			orderBy: {
				created_at: "desc"
			}
		});

		return surveys;
	} catch (error) {
		console.error("Error in getSurveysByUserId:", error);
		throw new Error("Failed to fetch surveys");
	}
};

export const getSurveyByIdWithDetails = async surveyId => {
	try {
		const survey = await prisma.survey.findUnique({
			where: {
				survey_id: surveyId
			},
			include: {
				questions: true,
				author: {
					select: {
						user_id: true,
						name: true,
						last_name: true
					}
				}
			}
		});

		return survey;
	} catch (error) {
		console.error("Error in getSurveyByIdWithDetails:", error);
		throw new Error("Failed to fetch survey details");
	}
};
export const getSurveyQuestions = async surveyId => {
	try {
		const questions = await prisma.question.findMany({
			where: { surveyId: parseInt(surveyId) },
			include: {
				author: {
					select: {
						name: true,
						last_name: true
					}
				}
			}
		});

		return questions;
	} catch (error) {
		console.error("Error fetching survey questions:", error);
		throw new Error("Failed to fetch questions");
	}
};
export const updateSurvey = async (surveyId, surveyData) => {
	try {
		const updatedSurvey = await prisma.survey.update({
			where: { survey_id: parseInt(surveyId) },
			data: surveyData,
			include: {
				author: {
					select: {
						name: true,
						last_name: true
					}
				},
				questions: true
			}
		});
		return updatedSurvey;
	} catch (error) {
		console.error("Error updating survey:", error);
		throw new Error("Failed to update survey");
	}
};
export const getSurveyResponders = async surveyId => {
	try {
		// First get all questions for this survey
		const questions = await prisma.question.findMany({
			where: {
				surveyId: parseInt(surveyId)
			},
			select: {
				question_id: true
			}
		});

		// Extract question IDs
		const questionIds = questions.map(q => q.question_id);

		// Find users who have answered these questions
		const answers = await prisma.answer.findMany({
			where: {
				questionId: {
					in: questionIds
				}
			},
			include: {
				author: {
					select: {
						user_id: true,
						name: true,
						last_name: true,
						email: true,
						role: true,
						created_at: true
					}
				}
			},
			orderBy: {
				created_at: "desc"
			}
		});

		const responderMap = {};
		answers.forEach(answer => {
			const userId = answer.author.user_id;

			if (!responderMap[userId]) {
				responderMap[userId] = {
					...answer.author,
					response_date: answer.created_at,
					answers_count: 1
				};
			} else {
				responderMap[userId].answers_count += 1;
				if (answer.created_at > responderMap[userId].response_date) {
					responderMap[userId].response_date = answer.created_at;
				}
			}
		});

		const responders = Object.values(responderMap).sort(
			(a, b) => b.response_date - a.response_date
		);

		return responders;
	} catch (error) {
		console.error("Error fetching survey responders:", error);
		throw new Error("Failed to fetch survey responders");
	}
};
export const getResponderAnswers = async (surveyId, responderId) => {
	try {
		const answers = await prisma.answer.findMany({
			where: {
				authorId: parseInt(responderId),
				question: {
					surveyId: parseInt(surveyId)
				}
			},
			include: {
				question: {
					select: {
						question_id: true,
						title: true,
						category: true
					}
				}
			},
			orderBy: {
				question: {
					question_id: "asc"
				}
			}
		});

		const formattedAnswers = answers.map(answer => ({
			answer_Id: answer.answer_Id,
			text: answer.text,
			created_at: answer.created_at,
			question_id: answer.question.question_id,
			question_title: answer.question.title,
			category: answer.question.category
		}));

		return formattedAnswers;
	} catch (error) {
		console.error("Error fetching responder answers:", error);
		throw new Error("Failed to fetch responder answers");
	}
};
