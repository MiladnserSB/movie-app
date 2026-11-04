"use client";

import { useEffect, useState } from "react";
import { request } from "@/app/service/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const ManageCastDialog = ({ isOpen, onClose, movie }: any) => {
  const [cast, setCast] = useState<any[]>([]);
  const [actors, setActors] = useState<any[]>([]);
  const [actorId, setActorId] = useState("");
  const [role, setRole] = useState("");

  const loadData = async () => {
    if (!movie) return;
    try {
      const [cRes, aRes]: any = await Promise.all([
        request(`role-actor/movie/${movie._id}`),
        request("actors"),
      ]);
      setCast(cRes?.data || cRes || []);
      setActors(Array.isArray(aRes) ? aRes : aRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isOpen && movie) loadData();
  }, [isOpen, movie]);

  if (!movie) return null;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actorId || !role) return;
    try {
      await request("role-actor", {
        method: "POST",
        body: { movieId: movie._id, actorId, role },
      });
      setActorId("");
      setRole("");
      loadData();
    } catch (err) {
      alert("Error adding actor");
    }
  };

  const handleRemove = async (actId: string) => {
    try {
      await request(`role-actor/${movie._id}/${actId}`, { method: "DELETE" });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent dir="rtl" className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>طاقم العمل: {movie.movieTitle}</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleAdd}
          className="space-y-3 bg-muted p-3 rounded-lg"
        >
          <select
            value={actorId}
            onChange={(e) => setActorId(e.target.value)}
            className="w-full p-2 border rounded bg-background"
            required
          >
            <option value="">اختر ممثلاً</option>
            {actors.map((a) => (
              <option key={a._id} value={a._id}>
                {a.actorName}
              </option>
            ))}
          </select>
          <Input
            placeholder="الدور (مثل: البطل)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />
          <Button type="submit" size="sm" className="w-full">
            إضافة للطاقم
          </Button>
        </form>

        <div className="space-y-2 mt-4">
          {cast.map((item) => (
            <div
              key={item._id}
              className="flex justify-between items-center p-2 border rounded"
            >
              <div>
                <p className="font-semibold">{item.actorId?.actorName}</p>
                <p className="text-xs text-muted-foreground">
                  الدور: {item.role}
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRemove(item.actorId?._id)}
              >
                حذف
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
