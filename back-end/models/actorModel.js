import mongoose from "mongoose";

const actorSchema = new mongoose.Schema(
  {
    actorName: { type: String, required: true, trim: true },
    actorBirthDate: { type: Date },
    actorNationality: { type: String, trim: true },
  },
  { timestamps: true },
);
const Actor = mongoose.model("Actor", actorSchema);

export default Actor;
