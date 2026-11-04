import { request } from "@/app/service/api";
import { CastMemberCard } from "@/app/components/CastMemberCard";
import { Badge } from "@/components/ui/badge";
import { Suspense } from "react";
import Loading from "../loading";

interface PageProps {
  params: Promise<{ movieId: string }>;
}

const MovieDetailsContent = async ({ movieId }: { movieId: string }) => {
  let movie: any = null;
  let cast: any[] = [];

  try {
    const [movieRes, castRes]: [any, any] = await Promise.all([
      request(`/movies/${movieId}`),
      request(`/role-actor/movie/${movieId}`),
    ]);

    movie = movieRes?.data || movieRes;
    cast = castRes?.data || castRes || [];
  } catch (error) {
    console.error("Error fetching movie details:", error);
  }

  if (!movie) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <h2 className="text-2xl text-red-500 font-bold">Movie not found!</h2>
      </div>
    );
  }

  const releaseYear = new Date(movie.movieReleaseDate).getFullYear();

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      {/* 1. قسم تفاصيل الفيلم بصرياً */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-md p-6 md:p-8 mb-10 border">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold mb-3">{movie.movieTitle}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              {releaseYear} • Directed by{" "}
              <span className="font-semibold text-black dark:text-white">
                {movie.movieDirector}
              </span>
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {movie.movieCategories?.map((cat: string, i: number) => (
                <Badge key={i} variant="outline" className="text-sm py-1">
                  {cat}
                </Badge>
              ))}
            </div>
          </div>

          <div className="bg-gray-100 dark:bg-zinc-800 rounded-lg p-4 flex flex-col items-center justify-center min-w-[120px]">
            <span className="text-sm text-gray-500 mb-1">Rating</span>
            <span className="text-3xl font-bold text-yellow-500">
              ⭐ {movie.movieRating}
            </span>
            <span className="text-xs text-gray-400">out of 10</span>
          </div>
        </div>
      </div>

      {/* 2. قسم طاقم العمل ومستخدمي المكون CastMemberCard */}
      <div>
        <h2 className="text-2xl font-bold mb-6 border-b pb-2">Cast & Roles</h2>

        {cast.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {cast.map((c: any) => (
              <CastMemberCard key={c._id} cast={c} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 dark:bg-zinc-900 rounded-lg text-gray-500 border">
            No cast information available for this movie.
          </div>
        )}
      </div>
    </div>
  );
};

const MovieDetailsPage = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  const movieId = resolvedParams.movieId;

  return (
    <Suspense fallback={<Loading />}>
      <MovieDetailsContent movieId={movieId} />
    </Suspense>
  );
};

export default MovieDetailsPage;
