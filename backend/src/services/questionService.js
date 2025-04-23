import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getQuestionById = async id => {
	try {
		const question = await prisma.question.findUnique({
			where: { question_id: parseInt(id) },
			include: {
				author: {
					select: {
						name: true,
						last_name: true
					}
				},
				survey: true
			}
		});

		if (!question) {
			throw new Error("Question not found");
		}

		return question;
	} catch (error) {
		console.error("Error fetching question:", error);
		throw error;
	}
};

export const createQuestion = async ({
	title,
	category,
	surveyId,
	authorId
}) => {
	try {
		const question = await prisma.question.create({
			data: {
				title,
				category,
				surveyId: parseInt(surveyId),
				authorId: parseInt(authorId)
			},
			include: {
				author: {
					select: {
						name: true,
						last_name: true
					}
				}
			}
		});

		return question;
	} catch (error) {
		console.error("Error creating question:", error);
		throw new Error("Failed to create question");
	}
};

export const updateQuestion = async (questionId, questionData) => {
	try {
		const updatedQuestion = await prisma.question.update({
			where: { question_id: questionId },
			data: questionData,
			include: {
				author: {
					select: {
						name: true,
						last_name: true
					}
				}
			}
		});

		return updatedQuestion;
	} catch (error) {
		console.error("Error updating question:", error);
		throw new Error("Failed to update question");
	}
};

export const deleteQuestion = async questionId => {
	try {
		await prisma.question.delete({
			where: { question_id: questionId }
		});

		return true;
	} catch (error) {
		console.error("Error deleting question:", error);
		throw new Error("Failed to delete question");
	}
};
