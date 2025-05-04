import {
	createQuestion,
	updateQuestion,
	deleteQuestion,
	getQuestionById
} from "../services/questionService.js";

export const getQuestion = async (req, res) => {
	const { id } = req.params;
	try {
		const question = await getQuestionById(id);
		res.status(200).json(question);
	} catch (error) {
		console.error("Error fetching question:", error);
		res.status(404).json({ error: error.message });
	}
};

export const addQuestion = async (req, res) => {
	try {
		const { title, category, surveyId, authorId } = req.body;

		if (!title || !category || !surveyId || !authorId) {
			return res.status(400).json({ message: "All fields are required" });
		}

		const question = await createQuestion({
			title,
			category,
			surveyId: parseInt(surveyId),
			authorId: parseInt(authorId)
		});

		res.status(201).json({
			message: "Question created successfully",
			question
		});
	} catch (error) {
		console.error("Error creating question:", error);
		res.status(500).json({
			message: "Error creating question",
			error: error.message
		});
	}
};

export const updateQuestionController = async (req, res) => {
	try {
		const { id } = req.params;
		const { title, category } = req.body;

		if (!title && !category) {
			return res.status(400).json({ message: "No update fields provided" });
		}

		const updatedQuestion = await updateQuestion(parseInt(id), {
			title,
			category
		});

		res.status(200).json({
			message: "Question updated successfully",
			question: updatedQuestion
		});
	} catch (error) {
		console.error("Error updating question:", error);
		res.status(500).json({
			message: "Failed to update question",
			error: error.message
		});
	}
};

export const deleteQuestionController = async (req, res) => {
	try {
		const { id } = req.params;
		await deleteQuestion(parseInt(id));

		res.status(200).json({
			message: "Question deleted successfully"
		});
	} catch (error) {
		console.error("Error deleting question:", error);
		res.status(500).json({
			message: "Failed to delete question",
			error: error.message
		});
	}
};
