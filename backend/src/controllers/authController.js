import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

export const register = async (req, res) => {
	try {
		const { email, name, lastName, password, role = "ASKER" } = req.body;

		if (!email || !name || !lastName || !password) {
			return res.status(400).json({ message: "All fields are required" });
		}

		const validRoles = ["ASKER", "RESPONDER"];
		if (!validRoles.includes(role)) {
			return res.status(400).json({ message: "Invalid role" });
		}

		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) {
			return res.status(400).json({ message: "User already exists" });
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

		res
			.status(201)
			.json({ message: "User registered successfully", user: newUser });
	} catch (error) {
		console.error("Error registering user:", error);
		res.status(500).json({ message: "Error registering user", error });
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res
				.status(400)
				.json({ message: "Email and password are required" });
		}

		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const token = jwt.sign(
			{ userId: user.user_id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
		);

		res.json({ message: "Login successful", token });
	} catch (error) {
		console.error("Error logging in:", error);
		res.status(500).json({ message: "Error logging in" });
	}
};
