import express from "express";
import { getResponderVideo } from "../controllers/videoController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/survey/:surveyId/responder/:responderId", getResponderVideo);

export default router;
