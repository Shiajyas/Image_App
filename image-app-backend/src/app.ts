import express from "express";
import cors from "cors";
import morgan from "morgan";
import { json, urlencoded } from "express";

import userRoutes from "./presentation/routes/user.routes.js";
import imageRoutes from "./presentation/routes/image.routes.js";
import { errorMiddleware } from "./presentation/middlewares/error.middleware.js";

const app = express();

// ✅ Allowed frontend domains (no paths!)
const allowedOrigins = [
  "http://localhost:5173",
  "https://image-app-ruby.vercel.app"
];

// ✅ Full CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Allow non-browser clients (Postman, etc.)
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS: " + origin));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

// ✅ Handle preflight requests explicitly (important for uploads)
app.options("*", cors());

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
