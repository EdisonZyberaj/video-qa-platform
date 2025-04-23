import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import {
	getSurveyById as fetchSurveyById,
	createSurveyWithQuestions,
	getAllSurveys,
	getSurveysByUserId,
	getSurveyQuestions as fetchQuestionsService,
	updateSurvey,
	getSurveyResponders as getSurveyResponderService,
	getResponderAnswers
} from "../services/surveyService.js";

dotenv.config();
const prisma = new PrismaClient();

export const getSurveyById = async (req, res) => {
	const { id } = req.params;
	try {
		const survey = await fetchSurveyById(id);
		res.status(200).json(survey);
	} catch (error) {
		console.error("Error fetching survey:", error);
		res.status(404).json({ error: error.message });
	}
};

export const addSurveyWithQuestions = async (req, res) => {
	try {
		const { title, description, authorId, questions } = req.body;

		if (
			!title ||
			!description ||
			!authorId ||
			!questions ||
			questions.length === 0
		) {
			return res
				.status(400)
				.json({ message: "All fields are required, including questions." });
		}

		const survey = await createSurveyWithQuestions({
			title,
			description,
			authorId,
			questions
		});
		res.status(201).json({ message: "Survey created successfully", survey });
	} catch (error) {
		console.error("Error creating survey:", error);
		res
			.status(500)
			.json({ message: "Error creating survey", error: error.message });
	}
};

export const getAllSurveysController = async (req, res) => {
	try {
		const surveys = await getAllSurveys();
		res.status(200).json(surveys);
	} catch (error) {
		console.log("Error fetching all surveys");
		res.status(404).json({ error: error.message });
	}
};

export const getUserSurveys = async (req, res) => {
	try {
		const userId = req.user.user_id;

		const surveys = await getSurveysByUserId(userId);

		res.status(200).json(surveys);
	} catch (error) {
		console.error("Error fetching user surveys:", error);
		res.status(500).json({ message: "Failed to fetch surveys" });
	}
};
export const getSurveyQuestions = async (req, res) => {
	const { id } = req.params;

	try {
		const questions = await fetchQuestionsService(id);
		res.status(200).json(questions);
	} catch (error) {
		console.error("Error fetching questions:", error);
		res.status(500).json({ error: "Failed to fetch questions" });
	}
};
export const updateSurveyController = async (req, res) => {
	try {
		const { id } = req.params;
		const updateData = req.body;

		if (Object.keys(updateData).length === 0) {
			return res.status(400).json({ message: "No update fields provided" });
		}

		const updatedSurvey = await updateSurvey(id, updateData);
		res.status(200).json({
			message: "Survey updated successfully",
			survey: updatedSurvey
		});
	} catch (error) {
		console.error("Error updating survey:", error);
		res.status(500).json({
			message: "Failed to update survey",
			error: error.message
		});
	}
};
export const getSurveyResponders = async (req, res) => {
	const { id } = req.params;

	try {
		const survey = await fetchSurveyById(id);
		const responders = await getSurveyResponderService(id);

		res.status(200).json({
			survey,
			responders
		});
	} catch (error) {
		console.error("Error fetching survey responders:", error);
		res.status(500).json({ error: "Failed to fetch survey responders" });
	}
};
export const getResponderAnswersController = async (req, res) => {
	const { surveyId, responderId } = req.params;

	try {
		const survey = await fetchSurveyById(surveyId);
		const responder = await prisma.user.findUnique({
			where: { user_id: parseInt(responderId) },
			select: {
				user_id: true,
				name: true,
				last_name: true,
				email: true,
				role: true
			}
		});

		if (!responder) {
			return res.status(404).json({ error: "Responder not found" });
		}

		const answers = await getResponderAnswers(surveyId, responderId);

		res.status(200).json({
			survey,
			responder,
			answers
		});
	} catch (error) {
		console.error("Error fetching responder answers:", error);
		res.status(500).json({ error: "Failed to fetch responder answers" });
	}
};
