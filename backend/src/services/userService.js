import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const getUserProfileById = async userId => {
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
};

export const updateUserProfile = async (userId, userData) => {
	const { name, last_name, email } = userData;

	if (!name || !last_name || !email) {
		throw new Error("All fields are required");
	}

	const existingUser = await prisma.user.findFirst({
		where: {
			email,
			NOT: {
				user_id: userId
			}
		}
	});

	if (existingUser) {
		throw new Error("Email is already in use");
	}

	const updatedUser = await prisma.user.update({
		where: { user_id: userId },
		data: { name, last_name, email }
	});

	return {
		user_id: updatedUser.user_id,
		name: updatedUser.name,
		last_name: updatedUser.last_name,
		email: updatedUser.email,
		role: updatedUser.role,
		created_at: updatedUser.created_at
	};
};

export const changePassword = async (userId, passwordData) => {
	const { currentPassword, newPassword, confirmPassword } = passwordData;

	if (!currentPassword || !newPassword || !confirmPassword) {
		throw new Error("All fields are required");
	}

	if (newPassword !== confirmPassword) {
		throw new Error("New passwords do not match");
	}

	const user = await prisma.user.findUnique({
		where: { user_id: userId }
	});

	if (!user) {
		throw new Error("User not found");
	}

	const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

	if (!isPasswordValid) {
		throw new Error("Current password is incorrect");
	}

	const saltRounds = 10;
	const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

	await prisma.user.update({
		where: { user_id: userId },
		data: {
			password: hashedPassword
		}
	});

	return true;
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
