import express from "express";
import cors from "cors";
import movieRouter from "./routes/movieRoutes.js";
import actorRouter from "./routes/actorRoutes.js";
const app = express();
app.use(express.json());
app.use(cors());
app.use(
  cors({
    exposedHeaders: ["Content-Range", "X-Content-Range"],
  }),
);

app.use("/movies", movieRouter);
app.use("/actors", actorRouter);
// app.use("/users", userRouter);
export default app;
