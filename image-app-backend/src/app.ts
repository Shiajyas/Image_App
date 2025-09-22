import express from "express";
import cors from "cors";
import morgan from "morgan";
import { json, urlencoded } from "express";

import userRoutes from "./presentation/routes/user.routes";
import imageRoutes from "./presentation/routes/image.routes";
import { errorMiddleware } from "./presentation/middlewares/error.middleware";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://image-app-ruby.vercel.app"
];

app.use(
  cors({    
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  })
);

// Handle preflight requests
app.options("*", cors({ origin: allowedOrigins, credentials: true }));

// Middleware
app.use(json());
app.use(urlencoded({ extended: true }));

// Logger
app.use(morgan("dev"));
app.disable("etag");

// Routes
app.use("/api/users", userRoutes);
app.use("/api/images", imageRoutes);

// Error handling
app.use(errorMiddleware);

export default app;
