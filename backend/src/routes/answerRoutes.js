import express from "express";
import {
	submitAnswer,
	getQuestionAnswers,
	getResponderAnswers
} from "../controllers/answerController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/submit", submitAnswer);

router.get("/question/:questionId", getQuestionAnswers);

router.get("/survey/:surveyId/responder/:responderId", getResponderAnswers);

export default router;
