import { PrismaClient } from "@prisma/client";
import { Readable } from "stream";
import drive from "../config/googleDrive.js";

const prisma = new PrismaClient();

export const submitAnswer = async (req, res) => {
  try {
    console.log("Received answer submission request:", { 
      body: req.body,
      file: req.file ? `File received: ${req.file.originalname}` : "No file received" 
    });
    
    // Parse the answers array from JSON
    let answers = [];
    try {
      answers = JSON.parse(req.body.answers || "[]");
      if (!Array.isArray(answers)) {
        answers = [answers]; // Convert to array if single object
      }
      console.log("Parsed answers:", answers);
    } catch (e) {
      console.error("Error parsing answers JSON:", e);
      return res.status(400).json({ error: "Invalid answers format" });
    }

    if (answers.length === 0) {
      return res.status(400).json({ error: "No answers provided" });
    }

    // Make sure user_id is accessed properly from req.user
    const userId = req.user?.user_id;
    
    if (!userId) {
      return res.status(401).json({ error: "User ID is missing. Please log in again." });
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { user_id: parseInt(userId) }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Use the surveyId from the first answer
    const surveyId = answers[0].surveyId;

    // Handle video upload if present
    let videoUploadResult = null;
    
    if (req.file) {
      try {
        // Check if user already has a video for this survey
        const existingVideo = await prisma.survey_Video.findFirst({
          where: {
            surveyId: parseInt(surveyId),
            uploaderId: parseInt(userId)
          }
        });

        if (!existingVideo) {
          console.log("Processing video upload...");
          videoUploadResult = await uploadVideoAnswer(req.file, surveyId, userId);
          console.log("Video upload successful:", videoUploadResult);
        } else {
          console.log("User already has a video for this survey, skipping video upload");
        }
      } catch (videoError) {
        console.error("Error handling video:", videoError);
        // Continue with text answers even if video upload fails
      }
    }

    // Process each answer
    const processedAnswers = [];
    for (const answer of answers) {
      const { text, questionId } = answer;
      
      // Allow empty text if there's a video
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

      // Verify question exists
      const question = await prisma.question.findFirst({
        where: {
          question_id: parseInt(questionId),
          surveyId: parseInt(surveyId)
        }
      });

      if (!question) {
        return res.status(404).json({ 
          error: `Question ${questionId} not found in survey ${surveyId}` 
        });
      }

      // Check for existing answer and update or create
      const existingAnswer = await prisma.answer.findFirst({
        where: {
          questionId: parseInt(questionId),
          authorId: parseInt(userId),
          surveyId: parseInt(surveyId)
        }
      });

      let processedAnswer;
      
      if (existingAnswer) {
        console.log("Updating existing answer for question:", questionId);
        processedAnswer = await prisma.answer.update({
          where: {
            answer_Id: existingAnswer.answer_Id
          },
          data: {
            text: text || (hasVideo ? "Video response provided" : ""),
            created_at: new Date()
          }
        });
      } else {
        console.log("Creating new answer for question:", questionId);
        processedAnswer = await prisma.answer.create({
          data: {
            text: text || (hasVideo ? "Video response provided" : ""),
            created_at: new Date(),
            authorId: parseInt(userId),
            surveyId: parseInt(surveyId),
            questionId: parseInt(questionId)
          }
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
    const answers = await prisma.answer.findMany({
      where: {
        questionId: parseInt(questionId)
      },
      include: {
        author: {
          select: {
            name: true,
            last_name: true,
            email: true
          }
        }
      },
      orderBy: {
        created_at: "desc"
      }
    });
    res.status(200).json(answers);
  } catch (error) {
    console.error("Error fetching answers:", error);
    res.status(500).json({ error: error.message || "Failed to fetch answers" });
  }
};

export const getResponderAnswers = async (req, res) => {
  const { surveyId, responderId } = req.params;

  try {
    const answers = await prisma.answer.findMany({
      where: {
        surveyId: parseInt(surveyId),
        authorId: parseInt(responderId)
      },
      include: {
        question: true
      },
      orderBy: {
        created_at: "desc"
      }
    });
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
    
    // Make sure the IDs are treated as numbers
    const numericSurveyId = parseInt(surveyId);
    const numericResponderId = parseInt(responderId);
    
    if (isNaN(numericSurveyId) || isNaN(numericResponderId)) {
      return res.status(400).json({ error: "Invalid surveyId or responderId" });
    }
    
    // Find the video in the database
    const videoAnswer = await prisma.survey_Video.findFirst({
      where: {
        surveyId: numericSurveyId,
        uploaderId: numericResponderId
      }
    });
    
    console.log("Video search result:", videoAnswer ? "Found" : "Not found");
    
    return res.status(200).json(videoAnswer);
  } catch (error) {
    console.error("Error fetching video answer:", error);
    res.status(500).json({ error: error.message || "Failed to fetch video answer" });
  }
};

// Video upload helper function
const uploadVideoAnswer = async (videoFile, surveyId, userId) => {
  try {
    console.log(
      `Attempting to upload video: ${videoFile.originalname} for survey ${surveyId} by user ${userId}`
    );
    console.log("File size:", videoFile.size, "bytes");
    console.log("File type:", videoFile.mimetype);

    // Validate inputs
    if (!videoFile || !videoFile.buffer) {
      throw new Error("Invalid video file");
    }

    if (!surveyId || !userId) {
      throw new Error("Missing surveyId or userId");
    }

    // Get folder ID from environment or use fallback
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID || "1NZ9mYYUALmOsgvB6TFJrS6iiTR4FXuWM";
    
    console.log("Using Google Drive folder ID:", folderId);
    
    // Fix for stream handling - use a more reliable approach
    const bufferStream = new Readable();
    bufferStream._read = () => {}; // Required for Node.js streams
    bufferStream.push(videoFile.buffer);
    bufferStream.push(null); // Signal end of the stream

    console.log("Uploading file to Google Drive...");
    
    // Use a unique filename with timestamp to avoid conflicts
    const filename = `survey_${surveyId}_user_${userId}_${Date.now()}.${videoFile.originalname.split('.').pop() || 'webm'}`;
    
    try {
      // Simplify upload parameters to debug
      const response = await drive.files.create({
        requestBody: {
          name: filename,
          parents: [folderId]
        },
        media: {
          mimeType: videoFile.mimetype,
          body: bufferStream
        },
        fields: "id,name,webViewLink,webContentLink"
      });

      console.log("File uploaded successfully, ID:", response.data.id);
      
      // Make the file publicly accessible
      await drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
          role: "reader",
          type: "anyone"
        }
      });
      
      console.log("Permissions set successfully");

      // Get the public URL
      const file = await drive.files.get({
        fileId: response.data.id,
        fields: "webViewLink,webContentLink"
      });

      const videoUrl = file.data.webViewLink || file.data.webContentLink;

      if (!videoUrl) {
        throw new Error("No video URL received from Google Drive");
      }

      console.log("Video URL obtained:", videoUrl);

      // Save the video reference in the database
      const videoAnswer = await prisma.survey_Video.create({
        data: {
          question_link: videoUrl,
          surveyId: parseInt(surveyId),
          uploaderId: parseInt(userId)
        }
      });

      console.log("Video reference saved successfully:", videoAnswer);
      return videoAnswer;
    } catch (uploadError) {
      console.error("Error during upload:", uploadError);
      if (uploadError.response) {
        console.error("Error response data:", uploadError.response.data);
      }
      throw new Error(`Upload failed: ${uploadError.message}`);
    }
  } catch (error) {
    console.error("Error uploading video answer:", error);
    throw error;
  }
};