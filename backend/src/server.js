import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { apiRouter } from "./routes/api.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Serve outputs static folder
app.use("/outputs", express.static(path.resolve(__dirname, "../outputs")));

// API Routes
app.use("/api", apiRouter);

// Health Check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "AI-Powered SVG Banner & Infographic Generation Engine",
    timestamp: new Date().toISOString()
  });
});

// Serve frontend built assets in production (Railway fullstack single-service deployment)
const frontendDist = path.resolve(__dirname, "../../frontend/dist");
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/outputs") || req.path === "/health") {
      return next();
    }
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` AI-Powered SVG Generation Engine Server`);
  console.log(` Listening on port: http://localhost:${PORT}`);
  console.log(` Health check:     http://localhost:${PORT}/health`);
  console.log(` API templates:    http://localhost:${PORT}/api/templates`);
  if (fs.existsSync(frontendDist)) {
    console.log(` Serving frontend: ${frontendDist}`);
  }
  console.log(`=======================================================`);
});
