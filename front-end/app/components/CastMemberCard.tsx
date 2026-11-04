import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const CastMemberCard = ({ cast }) => {
  const { actorId, role } = cast;
  
  if (!actorId) return null;

  return (
    <Link href={`/actors/${actorId._id}`}>
      <Card className="hover:shadow-md hover:border-primary transition-all cursor-pointer h-full">
        <CardContent className="p-4 flex flex-col justify-between h-full gap-3">
          <div>
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg">{actorId.actorName}</h3>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                as {role}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {actorId.actorNationality || "Nationality Unknown"}
            </p>
          </div>
          
          <div className="text-xs text-gray-400 mt-auto pt-2 border-t">
            Born: {actorId.actorBirthDate 
              ? new Date(actorId.actorBirthDate).toLocaleDateString() 
              : "N/A"}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};