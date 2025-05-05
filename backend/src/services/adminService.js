import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getDashboardStats = async () => {
	try {
		const [
			userCount,
			surveyCount,
			questionCount,
			answerCount,
			videoCount
		] = await Promise.all([
			prisma.user.count(),
			prisma.survey.count(),
			prisma.question.count(),
			prisma.answer.count(),
			prisma.survey_Video.count()
		]);

		const usersByRole = await prisma.user.groupBy({
			by: ["role"],
			_count: true
		});

		const roleCounts = {};
		usersByRole.forEach(item => {
			roleCounts[item.role] = item._count;
		});

		const recentAnswers = await prisma.answer.findMany({
			take: 10,
			orderBy: {
				created_at: "desc"
			},
			include: {
				author: {
					select: {
						name: true,
						last_name: true,
						email: true
					}
				},
				question: {
					select: {
						title: true
					}
				}
			}
		});
		const recentSurveys = await prisma.survey.findMany({
			take: 5,
			orderBy: {
				created_at: "desc"
			},
			include: {
				author: {
					select: {
						name: true,
						last_name: true
					}
				},
				_count: {
					select: {
						questions: true
					}
				}
			}
		});

		return {
			counts: {
				users: userCount,
				surveys: surveyCount,
				questions: questionCount,
				answers: answerCount,
				videos: videoCount
			},
			usersByRole: roleCounts,
			recentAnswers,
			recentSurveys
		};
	} catch (error) {
		console.error("Error fetching dashboard stats:", error);
		throw new Error("Failed to fetch dashboard statistics");
	}
};

export const getAllUsers = async () => {
	try {
		const users = await prisma.user.findMany({
			select: {
				user_id: true,
				name: true,
				last_name: true,
				email: true,
				role: true,
				created_at: true,
				_count: {
					select: {
						surveys: true,
						questions: true,
						answers: true,
						surveyVideos: true
					}
				}
			},
			orderBy: {
				created_at: "desc"
			}
		});

		return users;
	} catch (error) {
		console.error("Error fetching all users:", error);
		throw new Error("Failed to fetch users");
	}
};

export const deleteUser = async userId => {
	try {
		// First delete related records to avoid foreign key constraints
		await prisma.$transaction([
			prisma.answer.deleteMany({
				where: { authorId: parseInt(userId) }
			}),
			prisma.survey_Video.deleteMany({
				where: { uploaderId: parseInt(userId) }
			}),
			prisma.question.deleteMany({
				where: { authorId: parseInt(userId) }
			}),
			prisma.survey.deleteMany({
				where: { authorId: parseInt(userId) }
			}),
			prisma.user.delete({
				where: { user_id: parseInt(userId) }
			})
		]);

		return true;
	} catch (error) {
		console.error("Error deleting user:", error);
		throw new Error("Failed to delete user");
	}
};

export const getAllSurveys = async () => {
	try {
		const surveys = await prisma.survey.findMany({
			include: {
				author: {
					select: {
						name: true,
						last_name: true,
						email: true
					}
				},
				_count: {
					select: {
						questions: true
					}
				}
			},
			orderBy: {
				created_at: "desc"
			}
		});

		return surveys;
	} catch (error) {
		console.error("Error fetching all surveys:", error);
		throw new Error("Failed to fetch surveys");
	}
};
export const deleteSurvey = async surveyId => {
	try {
		// gjejm te gjitha pyejtjet e survey
		const questions = await prisma.question.findMany({
			where: { surveyId: parseInt(surveyId) },
			select: { question_id: true }
		});

		const questionIds = questions.map(q => q.question_id);

		await prisma.$transaction([
			prisma.answer.deleteMany({
				where: {
					questionId: {
						in: questionIds
					}
				}
			}),
			prisma.question.deleteMany({
				where: { surveyId: parseInt(surveyId) }
			}),
			prisma.survey_Video.deleteMany({
				where: { surveyId: parseInt(surveyId) }
			}),
			prisma.survey.delete({
				where: { survey_id: parseInt(surveyId) }
			})
		]);

		return true;
	} catch (error) {
		console.error("Error deleting survey:", error);
		throw new Error("Failed to delete survey");
	}
};
