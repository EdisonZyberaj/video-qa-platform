import { userService } from "../services/userService.js";
import { getUsersByIds as getUsersByIdsService } from "../services/userService.js";

export const getUserProfile = async (req, res) => {
	try {
		const userId = req.user.userId;

		const userProfile = await userService.getUserProfileById(userId);

		if (!userProfile) {
			return res.status(404).json({ message: "User not found" });
		}

		res.status(200).json(userProfile);
	} catch (error) {
		console.error("Error fetching user profile:", error);
		res.status(500).json({ message: "Failed to fetch user profile" });
	}
};

export const getUsersByIds = async (req, res) => {
	try {
		const { userIds } = req.body;

		if (!userIds || !Array.isArray(userIds)) {
			return res
				.status(400)
				.json({ message: "Invalid user IDs. Provide an array of IDs." });
		}

		const users = await getUsersByIdsService(userIds);

		if (!users || users.length === 0) {
			return res
				.status(404)
				.json({ message: "No users found for the provided IDs." });
		}

		res.status(200).json(users);
	} catch (error) {
		console.error("Error fetching users by IDs:", error);
		res.status(500).json({ message: "Failed to fetch users." });
	}
};
