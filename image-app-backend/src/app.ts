import express from "express";
import cors from "cors";
import morgan from "morgan"; // <-- Import logger
import { json, urlencoded } from "express";
import userRoutes from "./presentation/routes/user.routes";
import imageRoutes from "./presentation/routes/image.routes";
import { errorMiddleware } from "./presentation/middlewares/error.middleware";

const app = express();

// Middleware
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

// Logger
app.use(morgan("dev")); // Logs method, URL, status, response time
app.disable("etag")
// Routes
app.use("/api/users", userRoutes);
app.use("/api/images", imageRoutes);

// Error handling
app.use(errorMiddleware);

export default app;
