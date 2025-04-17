import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getSurveyById = async id => {
	const survey = await prisma.survey.findUnique({
		where: { survey_id: parseInt(id) },
		include: {
			questions: true
		}
	});

	if (!survey) {
		throw new Error("Survey not found");
	}

	return survey;
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
