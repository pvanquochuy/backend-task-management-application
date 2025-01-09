import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDatabase from "./config/database";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import { errorHandler } from "./middlewares/error.middleware";
dotenv.config();
connectDatabase();

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", taskRoutes); // Cấu hình route cho task

// Middleware xử lý lỗi
app.use(errorHandler);

export default app;
