// ---------------------------------------------------
// server.js (Production-Ready / Render Compatible)
// ---------------------------------------------------

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// ---------------------------------------------------
// ENVIRONMENT LOADING
// ---------------------------------------------------
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";

dotenv.config({ path: envFile });

// Initialize Cloudinary after env loads
await import("./config/cloudinary.js");

// ---------------------------------------------------
// EXPRESS APP
// ---------------------------------------------------
const app = express();

// ---------------------------------------------------
// GLOBAL MONGOOSE CACHED CONNECTION (VERCEL SAFE)
// ---------------------------------------------------
let globalConnection = globalThis.mongooseConnection;

async function connectDatabase() {
  if (globalConnection && globalConnection.readyState === 1) {
    return globalConnection;
  }

  globalConnection = await connectDB();
  globalThis.mongooseConnection = globalConnection;

  return globalConnection;
}

// ---------------------------------------------------
// CORS
// ---------------------------------------------------
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
  "https://valuation-qb2y.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (process.env.NODE_ENV !== "production") return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (origin.endsWith(".vercel.app")) return callback(null, true);
      console.warn("❌ CORS Blocked Origin:", origin);
      return callback(null, false);
    },
    credentials: true,
  })
);

// ---------------------------------------------------
// BODY PARSER
// ---------------------------------------------------
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));

// ---------------------------------------------------
// AUTO DB CONNECTOR
// ---------------------------------------------------
app.use(async (req, res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    res.status(503).json({
      message: "Database unavailable",
      error: error.message,
    });
  }
});

// ---------------------------------------------------
// PUBLIC ROUTES (NO AUTH MIDDLEWARE)
// ---------------------------------------------------
import authRoutes from "./routes/authRoutes.js";
app.use("/api/auth", authRoutes); // LOGIN IS PUBLIC

import deepseekStream from "./routes/deepSeekStream.js";
app.use("/api", deepseekStream); // AI STREAM IS PUBLIC

// ---------------------------------------------------
// AUTH MIDDLEWARE (PROTECT EVERYTHING BELOW)
// ---------------------------------------------------
import { authMiddleware } from "./middleware/authMiddleware.js";
app.use("/api", authMiddleware);

// ---------------------------------------------------
// PROTECTED ROUTES
// ---------------------------------------------------
import imageRoutes from "./routes/imageRoutes.js";
import customOptionsRoutes from "./routes/customOptionsRoutes.js";
import billRoutes from "./routes/billRoutes.js";
import ubiApfRoutes from "./routes/ubiApfRoutes.js";
import valuationRoutes from "./routes/ubiShopRoutes.js";
import bofMaharastraRoutes from "./routes/bomFlatRoutes.js";

app.use("/api/valuations", valuationRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/options", customOptionsRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/ubi-apf", ubiApfRoutes);
app.use("/api/bof-maharashtra", bofMaharastraRoutes);

// ---------------------------------------------------
// ROOT CHECK
// ---------------------------------------------------
app.get("/", (req, res) => {
  res.send("🚀 MERN Backend Running – Production Optimized");
});

// ---------------------------------------------------
// START SERVER
// ---------------------------------------------------
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  const mode =
    process.env.NODE_ENV === "production" ? "Production" : "Development";
  console.log(`🚀 ${mode} Server: http://localhost:${PORT}`);
});

// Error handling
server.on("error", (err) => {
  console.error("❌ Server Error:", err.message);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
  process.exit(1);
});

export default app;
