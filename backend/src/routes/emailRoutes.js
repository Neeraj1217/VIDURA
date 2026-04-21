import { Router } from "express";
import {
  generateAiReply,
  getInbox,
  getPriorityInbox,
  setPriorityOverride
} from "../controllers/emailController.js";

const emailRouter = Router();

emailRouter.get("/inbox", getInbox);
emailRouter.get("/priority", getPriorityInbox);
emailRouter.post("/priority/override", setPriorityOverride);
emailRouter.post("/reply", generateAiReply);

export default emailRouter;
