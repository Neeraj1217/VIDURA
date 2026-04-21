import { Router } from "express";
import { beginGoogleAuth, handleGoogleCallback } from "../controllers/authController.js";

const authRouter = Router();

authRouter.get("/google", beginGoogleAuth);
authRouter.get("/google/callback", handleGoogleCallback);

export default authRouter;
