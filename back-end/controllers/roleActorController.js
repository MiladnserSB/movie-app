import * as roleActorServices from "../services/roleActorService.js";

export const getCastByMovie = async (req, res) => {
  const movieId = req.params.id;
  try {
    const cast = await roleActorServices.getCastByMovie(movieId);
    res.json({ success: true, data: cast });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFilmographyByActor = async (req, res) => {
  const actorId = req.params.id;
  try {
    const films = await roleActorServices.getFilmographyByActor(actorId);
    res.json({ success: true, data: films });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addActorToMovie = async (req, res) => {
  const { movieId, actorId, role } = req.body;
  try {
    const relation = await roleActorServices.addActorToMovie(
      movieId,
      actorId,
      role,
    );
    res.status(201).json({ success: true, data: relation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateRole = async (req, res) => {
  const relationId = req.params.id;
  const { role } = req.body;
  try {
    const relation = await roleActorServices.updateRole(relationId, role);
    if (!relation) {
      return res
        .status(404)
        .json({ success: false, message: "Relation not found" });
    }
    res.status(200).json({ success: true, data: relation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeActorFromMovie = async (req, res) => {
  const { movieId, actorId } = req.params;
  try {
    const relation = await roleActorServices.removeActorFromMovie(
      movieId,
      actorId,
    );
    if (!relation) {
      return res
        .status(404)
        .json({ success: false, message: "Relation not found" });
    }
    res.status(200).json({ success: true, data: relation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
