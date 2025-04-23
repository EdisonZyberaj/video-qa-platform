// questionRoutes.js
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

// Get single question by ID
router.get("/:id", getQuestion);

// Create a new question
router.post("/", addQuestion);

// Update a question
router.patch("/:id", updateQuestionController);

// Delete a question
router.delete("/:id", deleteQuestionController);

export default router;
