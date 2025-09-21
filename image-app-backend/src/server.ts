
import "reflect-metadata"; // Required by tsyringe
import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import "./infrastructure/database/mongoose";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
