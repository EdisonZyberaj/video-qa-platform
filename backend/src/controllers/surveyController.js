import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

export const getSurveyById = async (req, res) => {
	const { id } = req.params;
	try {
		const survey = await prisma.survey.findUnique({
			where: { survey_id: parseInt(id) },
			include: {
				questions: true
			}
		});

		if (!survey) {
			return res.status(404).json({ error: "Survey not found" });
		}

		res.status(200).json(survey);
	} catch (error) {
		console.error("Error fetching survey:", error);
		res.status(500).json({ error: "Failed to fetch survey" });
	}
};
