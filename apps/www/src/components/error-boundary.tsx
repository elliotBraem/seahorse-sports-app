'use client';

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/types";

interface ErrorBoundaryProps {
  error: Error;
  reset: () => void;
  title?: string;
}

export default function ErrorBoundary({
  error,
  reset,
  title = 'Something went wrong!',
}: ErrorBoundaryProps) {
  const errorMessage = error instanceof ApiError ? error.message : title;

  return (
    <Container>
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <h2 className="text-xl font-semibold">{errorMessage}</h2>
        <Button onClick={reset}>Try again</Button>
      </div>
    </Container>
  );
}
