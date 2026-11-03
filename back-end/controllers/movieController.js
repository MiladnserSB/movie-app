import * as movieServices from "../services/movieService.js";

export const getAllMovies = async (req, res) => {
  try {
    const movies = await movieServices.getAllMovies();
    res.json({ success: true, data: movies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMovieById = async (req, res) => {
  const mid = req.params.id;
  try {
    const movie = await movieServices.getMovieById(mid);
    if (!movie) {
      return res
        .status(404)
        .json({ success: false, message: "Movie not found" });
    }
    res.json({ success: true, data: movie });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createNewMovie = async (req, res) => {
  const movieData = req.body;
  try {
    const movie = await movieServices.createNewMovie(movieData);
    res.status(201).json({ success: true, data: movie });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateMovie = async (req, res) => {
  const movieData = req.body;
  const mid = req.params.id;
  try {
    const movie = await movieServices.updateMovie(mid, movieData);
    if (!movie) {
      return res
        .status(404)
        .json({ success: false, message: "Movie not found" });
    }
    res.status(200).json({ success: true, data: movie });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMovie = async (req, res) => {
  const mid = req.params.id;
  try {
    const movie = await movieServices.deleteMovie(mid);
    if (!movie) {
      return res
        .status(404)
        .json({ success: false, message: "Movie not found" });
    }
    res.status(200).json({ success: true, data: movie });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
