import Movie from "../models/movieModel.js";

export const getAllMovies = () => Movie.find();

export const getMovieById = (mid) => Movie.findById(mid);

export const createNewMovie = (movieData) => Movie.create(movieData);

export const updateMovie = (mid, movieData) =>
  Movie.findByIdAndUpdate(mid, movieData, {
    new: true,
    runValidators: true,
  });

export const deleteMovie = (mid) => Movie.findByIdAndDelete(mid);
