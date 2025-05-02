import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const CLIENT_ID = process.env.GOOGLE_DRIVE_CLIENT_ID || "587879413575-3pfot10u3fm1o0gjlikfvnlf3360phuh.apps.googleusercontent.com";
const CLIENT_SECRET = process.env.GOOGLE_DRIVE_CLIENT_SECRET || "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";
const REDIRECT_URI = process.env.GOOGLE_DRIVE_REDIRECT_URI || "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = process.env.GOOGLE_DRIVE_REFRESH_TOKEN || "1//04WV1_dhzQyr2CgYIARAAGAQSNwF-L9Ir57p5DwsOmUgP_40Y8M-bNeVlD9a8ot6mAg8ETeWd-BW3lJnVhOiFRs6Xmt_yMg79Hw4";
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || "1NZ9mYYUALmOsgvB6TFJrS6iiTR4FXuWM";

console.log("Using Google Drive credentials");
console.log("Google Drive Config:", {
  clientId: CLIENT_ID ? "Set" : "Missing",
  clientSecret: CLIENT_SECRET ? "Set" : "Missing",
  redirectUri: REDIRECT_URI ? "Set" : "Missing",
  refreshToken: REFRESH_TOKEN ? "Set" : "Missing",
  folderId: FOLDER_ID ? "Set" : "Missing"
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
    fields: "user,storageQuota"
  })
  .then(response => {
    console.log("Google Drive connection successful!");
    
    return drive.files.get({
      fileId: FOLDER_ID,
      fields: "name,id,capabilities"
    });
  })
  .then(response => {
    console.log("Folder access verified. Folder name:", response.data.name);
    console.log("Can add files:", response.data.capabilities?.canAddChildren ? "Yes" : "No");
  })
  .catch(error => {
    console.error("Google Drive connection or folder access error:", error.message);
    if (error.response) {
      console.error("Error details:", error.response.data);
    } else {
      console.error("Error details:", error);
    }
  });

export default drive;