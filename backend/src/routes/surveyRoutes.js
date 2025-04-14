import express from "express";
import { getSurveyById } from "../controllers/surveyController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/:id", getSurveyById);

export default router;
