"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          خطایی رخ داده است!
        </h2>
        <p className="text-gray-600 mb-6">{error.message}</p>
        <button onClick={() => reset()} className="btn-primary">
          دوباره سعی کن
        </button>
      </div>
    </div>
  );
}
