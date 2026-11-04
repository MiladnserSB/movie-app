"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const MoviesError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto py-20 text-center space-y-4">
      <h2 className="text-2xl font-bold text-red-600">تعذر الاتصال بالخادم!</h2>
      <p className="text-gray-500">
        {error.message || "تأكد من أن سيرفر الباك إند يعمل على البورت 3000"}
      </p>
      <Button onClick={() => reset()} variant="outline">
        إعادة المحاولة
      </Button>
    </div>
  );
};

export default MoviesError;
