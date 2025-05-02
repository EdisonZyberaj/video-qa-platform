import { google } from "googleapis";

const CLIENT_ID =
	"587879413575-3pfot10u3fm1o0gjlikfvnlf3360phuh.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN =
	"1//04WV1_dhzQyr2CgYIARAAGAQSNwF-L9Ir57p5DwsOmUgP_40Y8M-bNeVlD9a8ot6mAg8ETeWd-BW3lJnVhOiFRs6Xmt_yMg79Hw4";
const FOLDER_ID = "1NZ9mYYUALmOsgvB6TFJrS6iiTR4FXuWM";

console.log("Using hardcoded Google Drive credentials");
console.log("Google Drive Config:", {
	clientId: CLIENT_ID ? "Set" : "Missing",
	clientSecret: CLIENT_SECRET ? "Set" : "Missing",
	redirectUri: REDIRECT_URI ? "Set" : "Missing",
	refreshToken: REFRESH_TOKEN ? "Set" : "Missing",
	folderId: [FOLDER_ID] ? "Set" : "Missing"
});

const oauth2Client = new google.auth.OAuth2(
	CLIENT_ID,
	CLIENT_SECRET,
	REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
	version: "v3",
	auth: oauth2Client
});

drive.about
	.get({
		fields: "user"
	})
	.then(response => {
		console.log("Google Drive connection successful!");
		console.log("User:", response.data.user);
	})
	.catch(error => {
		console.error("Google Drive connection error:", error.message);
		console.error("Error details:", error);
	});

export default drive;
