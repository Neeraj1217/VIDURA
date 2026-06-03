import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import authRouter from "./routes/authRoutes.js";
import emailRouter from "./routes/emailRoutes.js";
import priorityKeywordRouter from "./routes/priorityKeywordRoutes.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true
    })
  );
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (_req, res) => {
    res.status(200).json({ success: true, service: "VIDURA backend" });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/email", emailRouter);
  app.use("/api/emails", priorityKeywordRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export default createApp();
