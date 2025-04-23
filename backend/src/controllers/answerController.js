import { PrismaClient } from "@prisma/client";
import {
	addAnswer,
	getAnswersByQuestionId
} from "../services/answerService.js";

const prisma = new PrismaClient();

export const submitAnswer = async (req, res) => {
	const { text, surveyId, questionId } = req.body;
	const userId = req.user.userId;

	try {
		const user = await prisma.user.findUnique({
			where: { user_id: userId }
		});

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
		// nese na duhet qe vec roli responder te aksesoje kte endpoint
		// if (user.role !== "RESPONDER") {
		// 	return res
		// 		.status(403)
		// 		.json({ error: "Only responders can submit answers" });
		// }

		const question = await prisma.question.findFirst({
			where: {
				question_id: parseInt(questionId),
				surveyId: parseInt(surveyId)
			}
		});

		if (!question) {
			return res
				.status(404)
				.json({ error: "Question not found in this survey" });
		}

		const answer = await addAnswer({
			text,
			authorId: userId,
			surveyId: parseInt(surveyId),
			questionId: parseInt(questionId)
		});

		res.status(201).json({ message: "Answer submitted successfully", answer });
	} catch (error) {
		console.error("Error submitting answer:", error);
		res.status(500).json({ error: error.message || "Failed to submit answer" });
	}
};

export const getQuestionAnswers = async (req, res) => {
	const { questionId } = req.params;

	try {
		const answers = await getAnswersByQuestionId(questionId);
		res.status(200).json(answers);
	} catch (error) {
		console.error("Error fetching answers:", error);
		res.status(500).json({ error: error.message || "Failed to fetch answers" });
	}
};
