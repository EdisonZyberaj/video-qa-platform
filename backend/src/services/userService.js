import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const userService = {
	async getUserProfileById(userId) {
		const user = await prisma.user.findUnique({
			where: { user_id: userId },
			include: {
				surveys: true,
				questions: true,
				answers: true,
				surveyVideos: true
			}
		});

		if (!user) {
			return null;
		}

		return {
			user_id: user.user_id,
			name: user.name,
			last_name: user.last_name,
			email: user.email,
			role: user.role,
			created_at: user.created_at,
			surveysCount: user.surveys.length,
			questionsCount: user.questions.length,
			answersCount: user.answers.length,
			surveyVideosCount: user.surveyVideos.length
		};
	}
};

export const getUsersByIds = async userIds => {
	const users = await prisma.user.findMany({
		where: {
			user_id: {
				in: userIds
			}
		},
		select: {
			user_id: true,
			name: true,
			last_name: true,
			email: true,
			role: true
		}
	});

	return users;
};
