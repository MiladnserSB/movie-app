import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface Movie {
  _id: string;
  movieTitle: string;
  movieReleaseDate: string;
  movieCategories: string[];
  movieRating: number;
  movieDirector: string;
}

export const MovieCard = ({ movie }: { movie: Movie }) => {
  const releaseYear = new Date(movie.movieReleaseDate).getFullYear();

  return (
    <Link href={`/movies/${movie._id}`} className="block h-full">
      <Card className="hover:shadow-lg hover:border-primary transition-all cursor-pointer h-full flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-lg leading-tight">
              {movie.movieTitle}
            </CardTitle>
            <Badge variant="secondary" className="whitespace-nowrap">
              ⭐ {movie.movieRating}/10
            </Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {releaseYear} • {movie.movieDirector}
          </p>
        </CardHeader>

        <CardContent className="mt-auto">
          <div className="flex flex-wrap gap-1 mt-2">
            {movie.movieCategories?.map((cat, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {cat}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
