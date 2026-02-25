import "./config/global.js";
import express, { type Request, type Response } from "express";
import userRouter from "./routes/user.js";
import articleRouter from "./routes/article.js";
import favoriteRouter from "./routes/favorite.js";
import cookieHeader from "./middleware/cookieHeader.js";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

// CORS (ปรับ origin ตอน prod ได้)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://thoughtlinefrontend.vercel.app",
    ],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(cookieHeader.cookieHeader);

// -------- Routes -------- //
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Free Time Project By NODE.JS");
});

app.use("/api/user", userRouter);
app.use("/api/article", articleRouter);
app.use("/api/favorite", favoriteRouter);

export default app;
