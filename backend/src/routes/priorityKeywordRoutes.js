import { Router } from "express";
import {
  createPriorityKeyword,
  deletePriorityKeyword,
  getPriorityKeywords
} from "../controllers/priorityKeywordController.js";

const priorityKeywordRouter = Router();

priorityKeywordRouter.get("/priority/keywords", getPriorityKeywords);
priorityKeywordRouter.post("/priority/keywords", createPriorityKeyword);
priorityKeywordRouter.delete("/priority/keywords", deletePriorityKeyword);

export default priorityKeywordRouter;
