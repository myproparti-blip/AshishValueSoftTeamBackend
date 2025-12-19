// routes/authRoutes.js
import express from "express";
import { login, logout, refreshTokenEndpoint } from "../controllers/authController.js";
import { optionalAuthMiddleware } from "../middleware/optionalAuthMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", optionalAuthMiddleware, logout);
router.post("/refresh-token", refreshTokenEndpoint);

export default router;
