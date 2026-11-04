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
import { ActorFormDialog } from "./components/ActorFormDialog";

export const AdminActorsPage = () => {
  const [actors, setActors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedActor, setSelectedActor] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchActors = async () => {
    try {
      const response: any = await request("actors", { cache: "no-store" });
      setActors(Array.isArray(response) ? response : response.data || []);
    } catch (error) {
      console.error("Failed to fetch actors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActors();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this actor?")) return;
    try {
      await request(`actors/${id}`, { method: "DELETE" });
      setActors((prev) => prev.filter((a) => a._id !== id));
    } catch (error) {
      console.error("Failed to delete actor:", error);
    }
  };

  const handleEdit = (actor: any) => {
    setSelectedActor(actor);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedActor(null);
    setIsFormOpen(true);
  };

  if (loading) return <div className="p-10 text-center">Loading actors...</div>;

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Actors</h1>
        <Button onClick={handleCreate}>+ Add New Actor</Button>
      </div>

      <div className="border rounded-lg bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Actor Name</TableHead>
              <TableHead>Nationality</TableHead>
              <TableHead>Birth Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {actors.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-10 text-gray-500"
                >
                  No actors found.
                </TableCell>
              </TableRow>
            ) : (
              actors.map((actor) => (
                <TableRow key={actor._id}>
                  <TableCell className="font-semibold">
                    {actor.actorName}
                  </TableCell>
                  <TableCell>{actor.actorNationality || "Unknown"}</TableCell>
                  <TableCell>
                    {actor.actorBirthDate
                      ? new Date(actor.actorBirthDate).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(actor)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(actor._id)}
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

      {/* Dialog لإضافة وتعديل بيانات الممثل */}
      <ActorFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        actor={selectedActor}
        onSuccess={fetchActors}
      />
    </div>
  );
};

export default AdminActorsPage;
