import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

export const register = async (req, res) => {
	try {
		const { email, name, password } = req.body;
		// para se te bejme register kontrollojme ne databaze nqs kemi user te regjistruar
		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) {
			return res.status(400).json({ message: "User already exists" });
		}
		// meqenese u siguruam qe useri nuk eshte regjistruar me pare
		const hashedPassword = await bcrypt.hash(password, 10);

		await prisma.user.create({
			data: {
				email,
				name,
				passwordHash: hashedPassword,
				role: "USER"
			}
		});

		res.status(201).json({ message: "User registered successfully" });
	} catch (error) {
		res.status(500).json({ message: "Error registering user", error });
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Kerkojme userin ne databze
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
		if (!isPasswordValid) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		// gjenerojm token
		const token = jwt.sign(
			{ userId: user.id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: process.env.JWT_EXPIRES_IN }
		);

		res.json({ message: "Login successful", token });
	} catch (error) {
		res.status(500).json({ message: "Error logging in", error });
	}
};
