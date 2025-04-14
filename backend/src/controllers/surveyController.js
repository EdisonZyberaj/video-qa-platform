import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { getSurveyById as fetchSurveyById } from "../services/surveyService.js";

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
