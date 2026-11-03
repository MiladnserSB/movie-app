import { Router } from "express";
import {
  getCastByMovie,
  getFilmographyByActor,
  addActorToMovie,
  updateRole,
  removeActorFromMovie,
} from "../controllers/roleActorController.js";

const roleActorRouter = Router();

roleActorRouter.route("/").post(addActorToMovie);

roleActorRouter.route("/movie/:id").get(getCastByMovie);

roleActorRouter.route("/actor/:id").get(getFilmographyByActor);

roleActorRouter.route("/:id").put(updateRole);

roleActorRouter.route("/:movieId/:actorId").delete(removeActorFromMovie);

export default roleActorRouter;
