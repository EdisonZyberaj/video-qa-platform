import express from "express";
import {
	submitAnswer,
	getQuestionAnswers
} from "../controllers/answerController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/submit", submitAnswer);

router.get("/question/:questionId", getQuestionAnswers);

export default router;
