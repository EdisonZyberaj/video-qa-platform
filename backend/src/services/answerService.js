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
export const uploadVideoAnswer = async (videoFile, surveyId, userId) => {
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

		// Check folder ID exists
		const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
		if (!folderId) {
			throw new Error(
				"GOOGLE_DRIVE_FOLDER_ID is not set in environment variables"
			);
		}

		console.log("Creating readable stream from buffer...");
		// Create a readable stream from the buffer
		const stream = Readable.from(videoFile.buffer);

		console.log("Uploading file to Google Drive...");
		// Upload the file to Google Drive
		const response = await drive.files.create({
			requestBody: {
				name: videoFile.originalname,
				parents: [folderId],
				mimeType: videoFile.mimetype
			},
			media: {
				mimeType: videoFile.mimetype,
				body: stream
			},
			fields: "id, name, webViewLink, webContentLink"
		});

		console.log("File uploaded successfully. Setting permissions...");
		// Make the file publicly accessible
		await drive.permissions.create({
			fileId: response.data.id,
			requestBody: {
				role: "reader",
				type: "anyone"
			}
		});

		console.log("Permissions set. Getting file URL...");
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
	} catch (error) {
		console.error("Error uploading video answer:", error);

		// Add detailed error information
		if (error.message.includes("invalid_client")) {
			console.error(
				"Authentication error with Google Drive API. Please check your credentials."
			);
		} else if (error.message.includes("invalid_grant")) {
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
