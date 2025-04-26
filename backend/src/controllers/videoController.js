import { getSurveyVideoByResponder } from "../services/videoService.js";

export const getResponderVideo = async (req, res) => {
	const { surveyId, responderId } = req.params;

	try {
		const video = await getSurveyVideoByResponder(surveyId, responderId);
		return res.status(200).json(video);
	} catch (error) {
		console.error("Error fetching responder video:", error);
		res
			.status(500)
			.json({ error: error.message || "Failed to fetch responder video" });
	}
};
