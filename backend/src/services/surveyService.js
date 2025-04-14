import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getSurveyById = async id => {
	const survey = await prisma.survey.findUnique({
		where: { survey_id: parseInt(id) },
		include: {
			questions: true
		}
	});

	if (!survey) {
		throw new Error("Survey not found");
	}

	return survey;
};
