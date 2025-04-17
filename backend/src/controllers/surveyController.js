import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import {
	getSurveyById as fetchSurveyById,
	createSurveyWithQuestions
} from "../services/surveyService.js";
import { getAllSurveys } from "../services/surveyService.js";
import { getSurveysByUserId } from "../services/surveyService.js";

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
		const userId = req.user.userId;

		const surveys = await getSurveysByUserId(userId);

		res.status(200).json(surveys);
	} catch (error) {
		console.error("Error fetching user surveys:", error);
		res.status(500).json({ message: "Failed to fetch surveys" });
	}
};
