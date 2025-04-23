import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const registerUser = async ({
	email,
	name,
	lastName,
	password,
	role
}) => {
	const existingUser = await prisma.user.findUnique({ where: { email } });
	if (existingUser) {
		throw new Error("User already exists");
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	const newUser = await prisma.user.create({
		data: {
			name,
			last_name: lastName,
			email,
			password: hashedPassword,
			role,
			created_at: new Date()
		}
	});

	return newUser;
};

export const loginUser = async ({ email, password }) => {
	const user = await prisma.user.findUnique({ where: { email } });
	if (!user) {
		throw new Error("Invalid credentials");
	}

	const isPasswordValid = await bcrypt.compare(password, user.password);
	if (!isPasswordValid) {
		throw new Error("Invalid credentials");
	}

	const token = jwt.sign(
		{ userId: user.user_id, role: user.role },
		process.env.JWT_SECRET,
		{ expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
	);

	console.log("u logoveee");
	return { token, user };
};
