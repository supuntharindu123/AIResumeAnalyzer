import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

// Configure environment variables first
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

import connectDB from "./utill/db.js";
import router from "./router.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());

const uploaddir = path.join("uploads");
if (!fs.existsSync(uploaddir)) {
  fs.mkdirSync(uploaddir, { recursive: true });
  console.log("Uploads directory created successfully");
}
app.use("/uploads", express.static("uploads"));

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
connectDB();
