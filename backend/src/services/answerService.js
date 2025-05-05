import { PrismaClient } from "@prisma/client";
import { Readable } from "stream";
import drive from "../config/googleDrive.js";
import path from "path";

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

export const updateAnswer = async (answerId, text) => {
	try {
		const updatedAnswer = await prisma.answer.update({
			where: {
				answer_Id: answerId
			},
			data: {
				text,
				created_at: new Date()
			}
		});
		return updatedAnswer;
	} catch (error) {
		console.error("Error updating answer:", error);
		throw error;
	}
};

export const findExistingAnswer = async (questionId, authorId, surveyId) => {
	try {
		const existingAnswer = await prisma.answer.findFirst({
			where: {
				questionId: parseInt(questionId),
				authorId: parseInt(authorId),
				surveyId: parseInt(surveyId)
			}
		});
		return existingAnswer;
	} catch (error) {
		console.error("Error finding existing answer:", error);
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

export const verifyQuestionInSurvey = async (questionId, surveyId) => {
	try {
		const question = await prisma.question.findFirst({
			where: {
				question_id: parseInt(questionId),
				surveyId: parseInt(surveyId)
			}
		});
		return question;
	} catch (error) {
		console.error("Error verifying question in survey:", error);
		throw error;
	}
};

export const verifyUserExists = async userId => {
	try {
		const user = await prisma.user.findUnique({
			where: { user_id: parseInt(userId) }
		});
		return user;
	} catch (error) {
		console.error("Error verifying user exists:", error);
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

export const uploadVideoAnswer = async (videoFile, surveyId, userId) => {
	try {
		if (!videoFile || !videoFile.buffer) {
			throw new Error("Invalid video file");
		}

		if (!surveyId || !userId) {
			throw new Error("Missing surveyId or userId");
		}
		const folderId =
			process.env.GOOGLE_DRIVE_FOLDER_ID || "1NZ9mYYUALmOsgvB6TFJrS6iiTR4FXuWM";

		console.log("Using Google Drive folder ID:", folderId);

		const bufferStream = new Readable();
		bufferStream._read = () => {};
		bufferStream.push(videoFile.buffer);
		bufferStream.push(null);

		const filename = `survey_${surveyId}_user_${userId}_${Date.now()}${path.extname(
			videoFile.originalname
		) || ".webm"}`;

		try {
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

			//e bejme videon te aksesueshme per kedo
			await drive.permissions.create({
				fileId: response.data.id,
				requestBody: {
					role: "reader",
					type: "anyone"
				}
			});

			console.log("Permissions set successfully");

			const file = await drive.files.get({
				fileId: response.data.id,
				fields: "webViewLink,webContentLink"
			});
			//1 per ta par 2 per te ber download
			const videoUrl = file.data.webViewLink || file.data.webContentLink;

			if (!videoUrl) {
				throw new Error("No video URL received from Google Drive");
			}

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
