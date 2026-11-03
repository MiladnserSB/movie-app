import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    movieTitle: {
      type: String,
      required: true,
      trim: true,
    },

    movieReleaseDate: {
      type: Date,
      required: true,
    },

    movieCategories: [
      {
        type: String,
        trim: true,
      },
    ],

    movieRating: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },

    movieDirector: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;
