import { Router } from "express";
import {
  getAllActors,
  getActorById,
  createNewActor,
  updateActor,
  deleteActor,
} from "../controllers/actorController.js";

const actorRouter = Router();

actorRouter.route("/").get(getAllActors).post(createNewActor);
actorRouter
  .route("/:id")
  .get(getActorById)
  .put(updateActor)
  .delete(deleteActor);

export default actorRouter;
