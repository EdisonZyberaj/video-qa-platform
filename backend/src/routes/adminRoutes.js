import express from "express";
import {
	getDashboardStats,
	getAllUsers,
	deleteUser,
	getAllSurveys,
	deleteSurvey
} from "../controllers/adminController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/stats", getDashboardStats);

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

router.get("/surveys", getAllSurveys);
router.delete("/surveys/:id", deleteSurvey);

export default router;
