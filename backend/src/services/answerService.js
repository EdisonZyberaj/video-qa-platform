import { PrismaClient } from "@prisma/client";
import { Readable } from "stream";
import drive from "../config/googleDrive.js";

const prisma = new PrismaClient();

export const addAnswer = async ({ text, authorId, surveyId, questionId }) => {
	try {
		const answer = await prisma.answer.create({
			data: {
				text,
				created_at: new Date(),
				authorId: parseInt(authorId),
				surveyId: parseInt(surveyId),
				questionId: parseInt(questionId)
			}
		});
		return answer;
	} catch (error) {
		console.error("Error adding answer:", error);
		throw error;
	}
};
// Improved video upload helper function
const uploadVideoAnswer = async (videoFile, surveyId, userId) => {
  try {
    console.log(
      `Attempting to upload video: ${videoFile.originalname} for survey ${surveyId} by user ${userId}`
    );

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
    console.log("Video file details:", {
      filename: videoFile.originalname,
      mimetype: videoFile.mimetype,
      size: `${(videoFile.size / (1024 * 1024)).toFixed(2)} MB`
    });
    
    // Create a readable stream from the buffer
    const stream = require('stream');
    const bufferStream = new stream.PassThrough();
    bufferStream.end(videoFile.buffer);

    console.log("Uploading file to Google Drive...");
    // Upload the file to Google Drive with more detailed error reporting
    try {
      const response = await drive.files.create({
        requestBody: {
          name: `survey_${surveyId}_user_${userId}_${Date.now()}.${videoFile.originalname.split('.').pop()}`,
          parents: [folderId],
          mimeType: videoFile.mimetype
        },
        media: {
          mimeType: videoFile.mimetype,
          body: bufferStream
        },
        fields: "id, name, webViewLink, webContentLink"
      });
      
      console.log("File uploaded successfully, ID:", response.data.id);
      
      // Make the file publicly accessible
      try {
        await drive.permissions.create({
          fileId: response.data.id,
          requestBody: {
            role: "reader",
            type: "anyone"
          }
        });
        console.log("Permissions set successfully");
      } catch (permError) {
        console.error("Error setting permissions:", permError);
        if (permError.response) {
          console.error("Permission error data:", permError.response.data);
        }
        throw new Error("Failed to set file permissions");
      }

      // Get the public URL
      const file = await drive.files.get({
        fileId: response.data.id,
        fields: "webViewLink, webContentLink"
      });

      const videoUrl = file.data.webViewLink || file.data.webContentLink;

      if (!videoUrl) {
        throw new Error("No video URL received from Google Drive");
      }

      console.log("Video URL obtained:", videoUrl);
      console.log("Saving video reference in database...");

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
      console.error("Error in upload to Google Drive:");
      if (uploadError.response) {
        console.error("Status:", uploadError.response.status);
        console.error("Response data:", JSON.stringify(uploadError.response.data));
      } else {
        console.error("Error message:", uploadError.message);
      }
      throw new Error(`Failed to upload file: ${uploadError.message}`);
    }
  } catch (error) {
    console.error("Error uploading video answer:", error);

    // Add detailed error information
    if (error.message?.includes("invalid_client")) {
      console.error(
        "Authentication error with Google Drive API. Please check your credentials."
      );
    } else if (error.message?.includes("invalid_grant")) {
      console.error(
        "Your refresh token may have expired. Please generate a new refresh token."
      );
    }

    throw error;
  }
};

export const getAnswersByQuestionId = async questionId => {
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
		return answers;
	} catch (error) {
		console.error("Error getting answers by question ID:", error);
		throw error;
	}
};

export const getAnswersBySurveyAndResponderId = async (
	surveyId,
	responderId
) => {
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
		return answers;
	} catch (error) {
		console.error("Error getting answers by survey and responder:", error);
		throw error;
	}
};

export const getVideoAnswerBySurveyAndUploader = async (
	surveyId,
	uploaderId
) => {
	try {
		const videoAnswer = await prisma.survey_Video.findFirst({
			where: {
				surveyId: parseInt(surveyId),
				uploaderId: parseInt(uploaderId)
			}
		});
		return videoAnswer;
	} catch (error) {
		console.error("Error getting video answer:", error);
		throw error;
	}
};
