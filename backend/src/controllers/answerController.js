import {
  addAnswer,
  updateAnswer,
  findExistingAnswer,
  getAnswersByQuestionId,
  getAnswersBySurveyAndResponderId,
  verifyQuestionInSurvey,
  verifyUserExists,
  getVideoAnswerBySurveyAndUploader,
  uploadVideoAnswer
} from "../services/answerService.js";

export const submitAnswer = async (req, res) => {
  try {
    console.log("Received answer submission request:", { 
      body: req.body,
      file: req.file ? `File received: ${req.file.originalname}` : "No file received" 
    });
    
    let answers = [];
    try {
      answers = JSON.parse(req.body.answers || "[]");
      if (!Array.isArray(answers)) {
        answers = [answers]; 
      }
      console.log("Parsed answers:", answers);
    } catch (e) {
      console.error("Error parsing answers JSON:", e);
      return res.status(400).json({ error: "Invalid answers format" });
    }

    if (answers.length === 0) {
      return res.status(400).json({ error: "No answers provided" });
    }

    const userId = req.user?.user_id;
    
    if (!userId) {
      return res.status(401).json({ error: "User ID is missing. Please log in again." });
    }

    const user = await verifyUserExists(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const surveyId = answers[0].surveyId;

    let videoUploadResult = null;
    
    if (req.file) {
      try {
        const existingVideo = await getVideoAnswerBySurveyAndUploader(surveyId, userId);

        if (!existingVideo) {
          console.log("Processing video upload...");
          videoUploadResult = await uploadVideoAnswer(req.file, surveyId, userId);
          console.log("Video upload successful:", videoUploadResult);
        } else {
          console.log("User already has a video for this survey, skipping video upload");
        }
      } catch (videoError) {
        console.error("Error handling video:", videoError);
      }
    }

    const processedAnswers = [];
    for (const answer of answers) {
      const { text, questionId } = answer;
      
      const hasVideo = req.file != null;
      if (!text && !text.trim() && !hasVideo) {
        return res.status(400).json({ 
          error: "Text answer is required when no video is provided",
          providedAnswer: answer 
        });
      }

      if (!surveyId || !questionId) {
        return res.status(400).json({ 
          error: "Missing required fields: surveyId or questionId",
          providedAnswer: answer 
        });
      }

      const question = await verifyQuestionInSurvey(questionId, surveyId);

      if (!question) {
        return res.status(404).json({ 
          error: `Question ${questionId} not found in survey ${surveyId}` 
        });
      }

      const existingAnswer = await findExistingAnswer(questionId, userId, surveyId);

      let processedAnswer;
      
      if (existingAnswer) {
        console.log("Updating existing answer for question:", questionId);
        processedAnswer = await updateAnswer(
          existingAnswer.answer_Id,
          text || (hasVideo ? "Video response provided" : "")
        );
      } else {
        console.log("Creating new answer for question:", questionId);
        processedAnswer = await addAnswer({
          text: text || (hasVideo ? "Video response provided" : ""),
          authorId: userId,
          surveyId: surveyId,
          questionId: questionId
        });
      }
      
      processedAnswers.push(processedAnswer);
    }

    console.log("Answers processed successfully");
    return res.status(200).json({ 
      message: "Answers submitted successfully", 
      answers: processedAnswers,
      videoAdded: videoUploadResult !== null
    });
  } catch (error) {
    console.error("Error submitting answer:", error);
    res.status(500).json({ error: error.message || "Failed to submit answer" });
  }
};

export const getQuestionAnswers = async (req, res) => {
  const { questionId } = req.params;

  try {
    const answers = await getAnswersByQuestionId(questionId);
    res.status(200).json(answers);
  } catch (error) {
    console.error("Error fetching answers:", error);
    res.status(500).json({ error: error.message || "Failed to fetch answers" });
  }
};

export const getResponderAnswers = async (req, res) => {
  const { surveyId, responderId } = req.params;

  try {
    const answers = await getAnswersBySurveyAndResponderId(surveyId, responderId);
    res.status(200).json(answers);
  } catch (error) {
    console.error("Error fetching responder answers:", error);
    res.status(500).json({ error: error.message || "Failed to fetch responder answers" });
  }
};

export const getVideoAnswer = async (req, res) => {
  const { surveyId, responderId } = req.params;

  try {
    console.log(`Fetching video for survey:${surveyId} and responder:${responderId}`);
    
    const numericSurveyId = parseInt(surveyId);
    const numericResponderId = parseInt(responderId);
    
    if (isNaN(numericSurveyId) || isNaN(numericResponderId)) {
      return res.status(400).json({ error: "Invalid surveyId or responderId" });
    }
    
    const videoAnswer = await getVideoAnswerBySurveyAndUploader(surveyId, responderId);
    
    console.log("Video search result:", videoAnswer ? "Found" : "Not found");
    
    return res.status(200).json(videoAnswer);
  } catch (error) {
    console.error("Error fetching video answer:", error);
    res.status(500).json({ error: error.message || "Failed to fetch video answer" });
  }
};