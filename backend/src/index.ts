import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();
const PORT = process.env["PORT"] ?? 3000;

app.use(cors());
app.use(express.json());

// ── Routes ───────────────────────────────────────────────────────────────────
// Toutes les routes d'authentification sont regroupées sous /api/auth
// (ex: POST /api/auth/register, POST /api/auth/login)
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
