import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";

interface Actor {
  _id: string;
  actorName: string;
  actorBirthDate?: string;
  actorNationality?: string;
}

export const ActorCard = ({ actor }: { actor: Actor }) => {
  const birthYear = actor.actorBirthDate
    ? new Date(actor.actorBirthDate).getFullYear()
    : "N/A";

  return (
    <Link href={`/actors/${actor._id}`} className="block h-full">
      <Card className="hover:shadow-lg hover:border-primary transition-all cursor-pointer h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-xl text-primary">
            {actor.actorName}
          </CardTitle>
          <CardDescription>
            {actor.actorNationality || "Nationality Unknown"}
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-auto">
          <p className="text-sm text-gray-500">Birth Year: {birthYear}</p>
        </CardContent>
      </Card>
    </Link>
  );
};
