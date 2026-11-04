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

export const MovieFormDialog = ({ isOpen, onClose, movie, onSuccess }: any) => {
  const [form, setForm] = useState({
    title: "",
    director: "",
    date: "",
    rating: 0,
    categories: "",
  });

  useEffect(() => {
    if (movie) {
      setForm({
        title: movie.movieTitle || "",
        director: movie.movieDirector || "",
        date: movie.movieReleaseDate
          ? movie.movieReleaseDate.split("T")[0]
          : "",
        rating: movie.movieRating || 0,
        categories: movie.movieCategories
          ? movie.movieCategories.join(", ")
          : "",
      });
    } else {
      setForm({ title: "", director: "", date: "", rating: 0, categories: "" });
    }
  }, [movie, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      movieTitle: form.title,
      movieDirector: form.director,
      movieReleaseDate: form.date,
      movieRating: Number(form.rating),
      movieCategories: form.categories
        .split(",")
        .map((c: string) => c.trim())
        .filter(Boolean),
    };

    try {
      if (movie) {
        await request(`movies/${movie._id}`, { method: "PUT", body: payload });
      } else {
        await request("movies", { method: "POST", body: payload });
      }
      onSuccess();
      onClose();
    } catch (err) {
      alert("Error saving movie");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>{movie ? "تعديل فيلم" : "إضافة فيلم"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            placeholder="عنوان الفيلم"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <Input
            placeholder="المخرج"
            value={form.director}
            onChange={(e) => setForm({ ...form, director: e.target.value })}
            required
          />
          <Input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
          <Input
            type="number"
            placeholder="التقييم (0-10)"
            min="0"
            max="10"
            step="0.1"
            value={form.rating}
            onChange={(e) =>
              setForm({ ...form, rating: Number(e.target.value) })
            }
          />
          <Input
            placeholder="التصنيفات (مفصولة بفاصلة)"
            value={form.categories}
            onChange={(e) => setForm({ ...form, categories: e.target.value })}
          />
          <Button type="submit" className="w-full">
            حفظ
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
