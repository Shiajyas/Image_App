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

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true // if you need cookies or auth headers to be sent
}));

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
