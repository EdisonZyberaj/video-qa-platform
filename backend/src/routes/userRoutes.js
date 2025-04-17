import express from "express";
import {
	getUserProfile,
	getUsersByIds
} from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/profile", authMiddleware, getUserProfile);
router.post("/get-by-ids", getUsersByIds);

export default router;
