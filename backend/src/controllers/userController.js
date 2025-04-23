import {
	getUserProfileById,
	getUsersByIds as getUsersByIdsService,
	updateUserProfile,
	changePassword
} from "../services/userService.js";

export const getUserProfile = async (req, res) => {
	try {
		const user_id = req.user.user_id;

		const userProfile = await getUserProfileById(user_id);

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

export const updateUserProfileController = async (req, res) => {
	try {
		const userId = req.user.user_id;
		const userData = req.body;

		console.log(userData.name, userData.last_name, userData.email);

		const updatedUser = await updateUserProfile(userId, userData);

		res.status(200).json({
			message: "Profile updated successfully",
			user: updatedUser
		});
	} catch (error) {
		console.error("Error updating user profile:", error);

		if (
			error.message === "All fields are required" ||
			error.message === "Email is already in use"
		) {
			return res.status(400).json({ message: error.message });
		}

		res.status(500).json({ message: "Failed to update user profile" });
	}
};

export const changePasswordController = async (req, res) => {
	try {
		const userId = req.user.user_id;
		const passwordData = req.body;

		await changePassword(userId, passwordData);

		res.status(200).json({ message: "Password updated successfully" });
	} catch (error) {
		console.error("Error changing password:", error);

		if (
			[
				"All fields are required",
				"New passwords do not match",
				"Current password is incorrect"
			].includes(error.message)
		) {
			return res.status(400).json({ message: error.message });
		}

		if (error.message === "User not found") {
			return res.status(404).json({ message: error.message });
		}

		res.status(500).json({ message: "Failed to change password" });
	}
};
