import { request } from "@/app/service/api";
import { ActorCard } from "../components/ActorCard";

export const ActorsPage = async () => {
  let actors: any[] = [];

  try {
    const response: any = await request("actors", { cache: "no-store" });
    actors = Array.isArray(response) ? response : response.data || [];
  } catch (error) {
    console.error("Failed to fetch actors:", error);
  }

  if (actors.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500 text-lg">
        No actors found in the database.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Actors List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {actors.map((actor) => (
          <ActorCard key={actor._id} actor={actor} />
        ))}
      </div>
    </div>
  );
};

export default ActorsPage;
