import * as actorServices from "../services/actorService.js";

export const getAllActors = async (req, res) => {
  try {
    const actors = await actorServices.getAllActors();
    res.json({ success: true, data: actors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getActorById = async (req, res) => {
  const aid = req.params.id;
  try {
    const actor = await actorServices.getActorById(aid);
    if (!actor) {
      return res
        .status(404)
        .json({ success: false, message: "Actor not found" });
    }
    res.json({ success: true, data: actor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createNewActor = async (req, res) => {
  const actorData = req.body;
  try {
    const actor = await actorServices.createNewActor(actorData);
    res.status(201).json({ success: true, data: actor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateActor = async (req, res) => {
  const actorData = req.body;
  const aid = req.params.id;
  try {
    const actor = await actorServices.updateActor(aid, actorData);
    if (!actor) {
      return res
        .status(404)
        .json({ success: false, message: "Actor not found" });
    }
    res.status(200).json({ success: true, data: actor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteActor = async (req, res) => {
  const aid = req.params.id;
  try {
    const actor = await actorServices.deleteActor(aid);
    if (!actor) {
      return res
        .status(404)
        .json({ success: false, message: "Actor not found" });
    }
    res.status(200).json({ success: true, data: actor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
