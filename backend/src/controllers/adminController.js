import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
	try {
		// Count totals for main entities
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

		// Get user counts by role
		const usersByRole = await prisma.user.groupBy({
			by: ["role"],
			_count: true
		});

		// Format role counts into a more usable object
		const roleCounts = {};
		usersByRole.forEach(item => {
			roleCounts[item.role] = item._count;
		});

		// Get recent activities (last 10 answers)
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

		// Get recent surveys
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

		res.status(200).json({
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
		});
	} catch (error) {
		console.error("Error fetching dashboard stats:", error);
		res.status(500).json({ error: "Failed to fetch dashboard statistics" });
	}
};

// Get all users
export const getAllUsers = async (req, res) => {
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

		res.status(200).json(users);
	} catch (error) {
		console.error("Error fetching all users:", error);
		res.status(500).json({ error: "Failed to fetch users" });
	}
};

// Update user role
export const updateUserRole = async (req, res) => {
	const { id } = req.params;
	const { role } = req.body;

	if (!role || !["ASKER", "RESPONDER", "ADMIN"].includes(role)) {
		return res.status(400).json({ error: "Invalid role provided" });
	}

	try {
		const updatedUser = await prisma.user.update({
			where: { user_id: parseInt(id) },
			data: { role },
			select: {
				user_id: true,
				name: true,
				last_name: true,
				email: true,
				role: true
			}
		});

		res.status(200).json({
			message: "User role updated successfully",
			user: updatedUser
		});
	} catch (error) {
		console.error("Error updating user role:", error);
		res.status(500).json({ error: "Failed to update user role" });
	}
};

// Delete user
export const deleteUser = async (req, res) => {
	const { id } = req.params;

	try {
		// First delete related records to avoid foreign key constraints
		await prisma.$transaction([
			prisma.answer.deleteMany({
				where: { authorId: parseInt(id) }
			}),
			prisma.survey_Video.deleteMany({
				where: { uploaderId: parseInt(id) }
			}),
			prisma.question.deleteMany({
				where: { authorId: parseInt(id) }
			}),
			prisma.survey.deleteMany({
				where: { authorId: parseInt(id) }
			}),
			prisma.user.delete({
				where: { user_id: parseInt(id) }
			})
		]);

		res.status(200).json({
			message: "User and all associated data deleted successfully"
		});
	} catch (error) {
		console.error("Error deleting user:", error);
		res.status(500).json({ error: "Failed to delete user" });
	}
};

// Get all surveys with details
export const getAllSurveys = async (req, res) => {
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

		res.status(200).json(surveys);
	} catch (error) {
		console.error("Error fetching all surveys:", error);
		res.status(500).json({ error: "Failed to fetch surveys" });
	}
};

// Delete survey
export const deleteSurvey = async (req, res) => {
	const { id } = req.params;

	try {
		// First find all questions in this survey
		const questions = await prisma.question.findMany({
			where: { surveyId: parseInt(id) },
			select: { question_id: true }
		});

		const questionIds = questions.map(q => q.question_id);

		// Delete in transaction to maintain database integrity
		await prisma.$transaction([
			// Delete answers to questions in this survey
			prisma.answer.deleteMany({
				where: {
					questionId: {
						in: questionIds
					}
				}
			}),
			// Delete questions in this survey
			prisma.question.deleteMany({
				where: { surveyId: parseInt(id) }
			}),
			// Delete video responses
			prisma.survey_Video.deleteMany({
				where: { surveyId: parseInt(id) }
			}),
			// Finally delete the survey
			prisma.survey.delete({
				where: { survey_id: parseInt(id) }
			})
		]);

		res.status(200).json({
			message: "Survey and all associated data deleted successfully"
		});
	} catch (error) {
		console.error("Error deleting survey:", error);
		res.status(500).json({ error: "Failed to delete survey" });
	}
};
