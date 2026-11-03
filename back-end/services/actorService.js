import Actor from "../models/actorModel.js";

export const getAllActors = () => Actor.find();

export const getActorById = (aid) => Actor.findById(aid);

export const createNewActor = (actorData) => Actor.create(actorData);

export const updateActor = (aid, actorData) =>
  Actor.findByIdAndUpdate(aid, actorData, {
    new: true, // يرجّع الوثيقة بعد التحديث
    runValidators: true, // يطبّق شروط الـ Schema
  });

export const deleteActor = (aid) => Actor.findByIdAndDelete(aid);
