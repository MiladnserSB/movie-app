"use client";

import { useEffect, useState } from "react";
import { request } from "@/app/service/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MovieFormDialog } from "./components/MovieFormDialog";
import { ManageCastDialog } from "./components/ManageCastDialog";

export const AdminMoviesPage = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCastOpen, setIsCastOpen] = useState(false);

  const fetchMovies = async () => {
    try {
      const response: any = await request("movies", { cache: "no-store" });
      setMovies(Array.isArray(response) ? response : response.data || []);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this movie?")) return;
    try {
      await request(`movies/${id}`, { method: "DELETE" });
      setMovies((prev) => prev.filter((m) => m._id !== id));
    } catch (error) {
      console.error("Failed to delete movie:", error);
    }
  };

  const handleEdit = (movie: any) => {
    setSelectedMovie(movie);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedMovie(null);
    setIsFormOpen(true);
  };

  const handleManageCast = (movie: any) => {
    setSelectedMovie(movie);
    setIsCastOpen(true);
  };

  if (loading) return <div className="p-10 text-center">Loading movies...</div>;

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Movies</h1>
        <Button onClick={handleCreate}>+ Add New Movie</Button>
      </div>

      <div className="border rounded-lg bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Director</TableHead>
              <TableHead>Release Date</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Categories</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movies.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-gray-500"
                >
                  No movies found.
                </TableCell>
              </TableRow>
            ) : (
              movies.map((movie) => (
                <TableRow key={movie._id}>
                  <TableCell className="font-semibold">
                    {movie.movieTitle}
                  </TableCell>
                  <TableCell>{movie.movieDirector}</TableCell>
                  <TableCell>
                    {new Date(movie.movieReleaseDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>⭐ {movie.movieRating}/10</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {movie.movieCategories?.map((cat: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleManageCast(movie)}
                    >
                      Cast
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(movie)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(movie._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog للإضافة والتعديل */}
      <MovieFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        movie={selectedMovie}
        onSuccess={fetchMovies}
      />

      {/* Dialog لإدارة طاقم الممثلين في الفيلم */}
      <ManageCastDialog
        isOpen={isCastOpen}
        onClose={() => setIsCastOpen(false)}
        movie={selectedMovie}
      />
    </div>
  );
};

export default AdminMoviesPage;
