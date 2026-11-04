import { request } from "@/app/service/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Suspense } from "react";
import Loading from "./loading";


interface PageProps {
  params: Promise<{ actorId: string }>;
}

const ActorDetailsContent = async ({ actorId }: { actorId: string }) => {
  let actor: any = null;
  let filmography: any[] = [];

  try {
    const [actorRes, filmRes]: [any, any] = await Promise.all([
      request(`/actors/${actorId}`),
      request(`/role-actor/actor/${actorId}`),
    ]);

    actor = actorRes?.data || actorRes;
    filmography = filmRes?.data || filmRes || [];
  } catch (error) {
    console.error("Error fetching actor details:", error);
  }

  if (!actor) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <h2 className="text-2xl text-red-500 font-bold">Actor not found!</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      {/* 1. قسم معلومات الممثل */}
      <Card className="mb-10 shadow-md">
        <CardHeader>
          <CardTitle className="text-4xl font-extrabold">
            {actor.actorName}
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-400 mt-2">
            Nationality:{" "}
            <span className="font-semibold">
              {actor.actorNationality || "Unknown"}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Birth Date:{" "}
            {actor.actorBirthDate
              ? new Date(actor.actorBirthDate).toLocaleDateString()
              : "N/A"}
          </p>
        </CardContent>
      </Card>

      {/* 2. قسم أعمال الممثل (Filmography) */}
      <div>
        <h2 className="text-2xl font-bold mb-6 border-b pb-2">
          Filmography & Roles
        </h2>

        {filmography.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filmography.map((item: any) => {
              const movie = item.movieId;
              if (!movie) return null;

              return (
                <Link key={item._id} href={`/movies/${movie._id}`}>
                  <Card className="hover:border-primary transition-all cursor-pointer h-full flex flex-col justify-between">
                    <CardHeader>
                      <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-lg leading-tight text-primary">
                          {movie.movieTitle}
                        </CardTitle>
                        <Badge
                          variant="secondary"
                          className="bg-yellow-100 text-yellow-800"
                        >
                          as {item.role}
                        </Badge>
                      </div>
                      <CardDescription className="mt-1">
                        Director: {movie.movieDirector}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto">
                      <p className="text-xs text-gray-400">
                        Rating: ⭐ {movie.movieRating}/10
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 dark:bg-zinc-900 rounded-lg text-gray-500 border">
            No movies recorded for this actor.
          </div>
        )}
      </div>
    </div>
  );
};

const ActorDetailsPage = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  const actorId = resolvedParams.actorId;

  return (
    <Suspense fallback={<Loading />}>
      <ActorDetailsContent actorId={actorId} />
    </Suspense>
  );
};

export default ActorDetailsPage;
