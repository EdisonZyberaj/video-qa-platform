import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addAnswer = async ({ text, authorId, surveyId, questionId }) => {
	try {
		const answer = await prisma.answer.create({
			data: {
				text,
				created_at: new Date(),
				authorId,
				surveyId,
				questionId
			}
		});

		return answer;
	} catch (error) {
		console.error("Error adding answer:", error);
		throw new Error("Failed to add answer");
	}
};

export const getAnswersByQuestionId = async questionId => {
	try {
		const answers = await prisma.answer.findMany({
			where: { questionId: parseInt(questionId) },
			include: {
				author: {
					select: {
						name: true,
						last_name: true
					}
				}
			},
			orderBy: { created_at: "desc" }
		});

		return answers;
	} catch (error) {
		console.error("Error fetching answers:", error);
		throw new Error("Failed to fetch answers");
	}
};
