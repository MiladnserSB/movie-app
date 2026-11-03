import mongoose from "mongoose";

const roleActorSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Actor",
      required: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

const RoleActor = mongoose.model("RoleActor", roleActorSchema);
export default RoleActor;
