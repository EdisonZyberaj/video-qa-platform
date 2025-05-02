import express from "express";
import {
	submitAnswer,
	getQuestionAnswers,
	getResponderAnswers,
	getVideoAnswer
} from "../controllers/answerController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
	storage: storage,
	limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

// Get all answers for a specific question
router.get("/question/:questionId", authMiddleware, getQuestionAnswers);

// Get all answers from a specific responder for a survey
router.get(
	"/survey/:surveyId/responder/:responderId",
	authMiddleware,
	getResponderAnswers
);

// Get video answer for a specific survey and responder
router.get(
	"/survey/:surveyId/video/:responderId",
	authMiddleware,
	getVideoAnswer
);

// Submit an answer (with optional video)
router.post("/submit", authMiddleware, upload.single("video"), submitAnswer);

export default router;
