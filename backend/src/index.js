import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import surveyRoutes from "./routes/surveyRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import answerRoutes from "./routes/answerRoutes.js";

import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/surveys", surveyRoutes);
app.use("/api/user", userRoutes);
app.use("/api/answers", answerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
