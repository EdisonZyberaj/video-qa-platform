import express from "express";
import {
	getSurveyById,
	addSurveyWithQuestions,
	getAllSurveysController,
	getUserSurveys,
	getSurveyQuestions,
	updateSurveyController,
	getSurveyResponders,
	getResponderAnswersController
} from "../controllers/surveyController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/get-all-surveys", getAllSurveysController);
router.get("/my-surveys", getUserSurveys);
router.get("/:id", getSurveyById);
router.get("/:id/questions", getSurveyQuestions);
router.post("/add-survey", addSurveyWithQuestions);
router.patch("/:id/update-survey", updateSurveyController);
router.get("/:id/responders", getSurveyResponders);
router.get("/:surveyId/responder/:responderId", getResponderAnswersController);
export default router;
