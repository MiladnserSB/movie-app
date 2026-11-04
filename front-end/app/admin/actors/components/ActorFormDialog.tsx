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

export const ActorFormDialog = ({ isOpen, onClose, actor, onSuccess }: any) => {
  const [form, setForm] = useState({
    name: "",
    nationality: "",
    birthDate: "",
  });

  useEffect(() => {
    if (actor) {
      setForm({
        name: actor.actorName || "",
        nationality: actor.actorNationality || "",
        birthDate: actor.actorBirthDate
          ? actor.actorBirthDate.split("T")[0]
          : "",
      });
    } else {
      setForm({ name: "", nationality: "", birthDate: "" });
    }
  }, [actor, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      actorName: form.name,
      actorNationality: form.nationality,
      actorBirthDate: form.birthDate,
    };

    try {
      if (actor) {
        await request(`actors/${actor._id}`, { method: "PUT", body: payload });
      } else {
        await request("actors", { method: "POST", body: payload });
      }
      onSuccess();
      onClose();
    } catch (err) {
      alert("Error saving actor");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>
            {(movieOrActor) => (actor ? "تعديل ممثل" : "إضافة ممثل")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            placeholder="اسم الممثل"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            placeholder="الجنسية"
            value={form.nationality}
            onChange={(e) => setForm({ ...form, nationality: e.target.value })}
          />
          <Input
            type="date"
            value={form.birthDate}
            onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
          />
          <Button type="submit" className="w-full">
            حفظ
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
