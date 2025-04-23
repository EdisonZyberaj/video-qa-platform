import express from "express";
import {
	getUserProfile,
	getUsersByIds,
	updateUserProfileController,
	changePasswordController
} from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/profile", authMiddleware, getUserProfile);
router.put("/update-profile", authMiddleware, updateUserProfileController);
router.post("/change-password", authMiddleware, changePasswordController);
router.post("/get-by-ids", getUsersByIds);

export default router;
