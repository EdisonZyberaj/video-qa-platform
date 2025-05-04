const adminMiddleware = (req, res, next) => {
	try {
		if (!req.user || req.user.role !== "ADMIN") {
			return res
				.status(403)
				.json({ message: "Access denied. Admin privileges required." });
		}

		next();
	} catch (error) {
		console.error("Admin middleware error:", error);
		return res.status(500).json({ message: "Server error" });
	}
};

export default adminMiddleware;
