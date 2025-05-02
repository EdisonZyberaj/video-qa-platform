import express from "express";
import {
	getQuestion,
	addQuestion,
	updateQuestionController,
	deleteQuestionController
} from "../controllers/questionController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/:id", getQuestion);

router.post("/", addQuestion);

router.patch("/:id", updateQuestionController);

router.delete("/:id", deleteQuestionController);

export default router;
