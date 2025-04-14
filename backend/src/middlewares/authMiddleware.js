import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = (req, res, next) => {
	const token = req.header("Authorization");

	if (!token) {
		return res
			.status(401)
			.json({ message: "Access denied. No token provided." });
	}

	try {
		const actualToken = token.replace("Bearer ", "").trim();
		const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

		req.user = decoded;
		next();
	} catch (error) {
		res.status(400).json({ message: "Invalid token" });
	}
};

export default authMiddleware;
