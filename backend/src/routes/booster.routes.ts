import { Router } from "express";
import { getMyBoosters } from "../controllers/booster.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const boosterRouter = Router();

boosterRouter.get("/detenus", requireAuth, getMyBoosters);

export { boosterRouter };
