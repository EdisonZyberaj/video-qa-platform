import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({ message: "Authentication required" });
		}

		const token = authHeader.split(" ")[1];

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		req.user = {
			userId: decoded.userId,
			email: decoded.email,
			role: decoded.role
		};

		next();
	} catch (error) {
		console.error("Auth error:", error);
		return res.status(401).json({ message: "Invalid token" });
	}
};

export default authMiddleware;
