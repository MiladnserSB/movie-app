import { Router } from "express";
import {
  getAllMovies,
  getMovieById,
  createNewMovie,
  updateMovie,
  deleteMovie,
} from "../controllers/movieController.js";

const movieRouter = Router();

movieRouter.route("/").get(getAllMovies).post(createNewMovie);
movieRouter
  .route("/:id")
  .get(getMovieById)
  .put(updateMovie)
  .delete(deleteMovie);

export default movieRouter;
