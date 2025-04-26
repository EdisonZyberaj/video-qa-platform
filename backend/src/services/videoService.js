import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getSurveyVideoByResponder = async (surveyId, responderId) => {
	try {
		const video = await prisma.survey_Video.findFirst({
			where: {
				surveyId: parseInt(surveyId),
				uploaderId: parseInt(responderId)
			}
		});

		return video;
	} catch (error) {
		console.error("Error fetching survey video:", error);

		return null;
	}
};
