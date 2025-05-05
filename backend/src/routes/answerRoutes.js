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
	limits: { fileSize: 100 * 1024 * 1024 }
});

router.get("/question/:questionId", authMiddleware, getQuestionAnswers);

router.get(
	"/survey/:surveyId/responder/:responderId",
	authMiddleware,
	getResponderAnswers
);

router.get(
	"/survey/:surveyId/video/:responderId",
	authMiddleware,
	getVideoAnswer
);

router.post("/submit", authMiddleware, upload.single("video"), submitAnswer);

export default router;
