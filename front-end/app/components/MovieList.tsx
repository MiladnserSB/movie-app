import { MovieCard } from "./MovieCard";
import { request } from "../service/api";

export const MovieList = async () => {
  let movies: any[] = [];

  try {
    const response: any = await request("movies", { cache: "no-store" });
    // دعم الحالتين: إما أن الباك إند يُرجع مصفوفة مباشرة أو كائن بداخله data
    movies = Array.isArray(response) ? response : response.data || [];

  } catch (error) {
    console.error("Failed to fetch movies:", error);
    throw error;
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500 text-lg">
        No movies found in the database.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Movies List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default MovieList;
