import {
	getDashboardStats as fetchDashboardStats,
	getAllUsers as fetchAllUsers,
	deleteUser as deleteUserService,
	getAllSurveys as fetchAllSurveys,
	deleteSurvey as deleteSurveyService
} from "../services/adminService.js";

export const getDashboardStats = async (req, res) => {
	try {
		const stats = await fetchDashboardStats();
		res.status(200).json(stats);
	} catch (error) {
		console.error("Error fetching dashboard stats:", error);
		res.status(500).json({ error: "Failed to fetch dashboard statistics" });
	}
};

export const getAllUsers = async (req, res) => {
	try {
		const users = await fetchAllUsers();
		res.status(200).json(users);
	} catch (error) {
		console.error("Error fetching all users:", error);
		res.status(500).json({ error: "Failed to fetch users" });
	}
};

export const deleteUser = async (req, res) => {
	const { id } = req.params;

	try {
		await deleteUserService(id);

		res.status(200).json({
			message: "User and all associated data deleted successfully"
		});
	} catch (error) {
		console.error("Error deleting user:", error);
		res.status(500).json({ error: "Failed to delete user" });
	}
};

export const getAllSurveys = async (req, res) => {
	try {
		const surveys = await fetchAllSurveys();
		res.status(200).json(surveys);
	} catch (error) {
		console.error("Error fetching all surveys:", error);
		res.status(500).json({ error: "Failed to fetch surveys" });
	}
};

export const deleteSurvey = async (req, res) => {
	const { id } = req.params;

	try {
		await deleteSurveyService(id);

		res.status(200).json({
			message: "Survey and all associated data deleted successfully"
		});
	} catch (error) {
		console.error("Error deleting survey:", error);
		res.status(500).json({ error: "Failed to delete survey" });
	}
};
