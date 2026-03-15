import { Router } from "express";
import { getMyProfile, login, logout, refreshSession, register, updateMyProfile } from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/refresh", refreshSession);
authRouter.post("/logout", logout);
authRouter.get("/me", requireAuth, getMyProfile);
authRouter.patch("/profile", requireAuth, updateMyProfile);

export { authRouter };
