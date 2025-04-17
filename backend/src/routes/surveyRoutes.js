import express from "express";
import {
	getSurveyById,
	addSurveyWithQuestions,
	getAllSurveysController,
	getUserSurveys
} from "../controllers/surveyController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/get-all-surveys", getAllSurveysController);
router.get("/my-surveys", getUserSurveys);
router.get("/:id", getSurveyById);
router.post("/add-survey", addSurveyWithQuestions);

export default router;
