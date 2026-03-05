import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env["PORT"] ?? 3000;

app.use(cors());
app.use(express.json());

// TODO: importer et monter les routes ici

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
