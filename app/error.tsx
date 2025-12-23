"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  console.error(error);

  return (
    <div className="flex h-screen items-center justify-center">
      <div>
        <h2>Something went wrong</h2>
        <button onClick={reset}>Try again</button>
      </div>
    </div>
  );
}
