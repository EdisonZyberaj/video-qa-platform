import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json()); // parse req (http req) e kthen ne json dhe ja ngjit req.body.meqe punojme me te dhena json
app.use(cors());
app.use("/api/auth", authRoutes); // cdo req procesohet sipas authRoutes sic eshte percaktuar

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
