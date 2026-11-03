import RoleActor from "../models/roleActorModel.js";

export const getCastByMovie = (movieId) =>
  RoleActor.find({ movieId }).populate(
    "actorId",
    "actorName",
  );

export const getFilmographyByActor = (actorId) =>
  RoleActor.find({ actorId }).populate(
    "movieId",
    "movieTitle movieReleaseDate movieRating movieCategories",
  );

export const addActorToMovie = (movieId, actorId, role) =>
  RoleActor.create({ movieId, actorId, role });

export const updateRole = (relationId, role) =>
  RoleActor.findByIdAndUpdate(
    relationId,
    { role },
    { new: true, runValidators: true },
  );

export const removeActorFromMovie = (movieId, actorId) =>
  RoleActor.findOneAndDelete({ movieId, actorId });
