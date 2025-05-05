import dotenv from "dotenv";
import { registerUser, loginUser } from "../services/authService.js";

dotenv.config();

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

		const newUser = await registerUser({
			email,
			name,
			lastName,
			password,
			role
		});
		res
			.status(201)
			.json({ message: "User registered successfully", user: newUser });
	} catch (error) {
		console.error("Error registering user:", error);
		res.status(500).json({ message: error.message });
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

		const { token, user } = await loginUser({ email, password });
		res.json({ message: "Login successful", token, user });
	} catch (error) {
		console.error("Error logging in:", error);
		res.status(401).json({ message: error.message });
	}
};
