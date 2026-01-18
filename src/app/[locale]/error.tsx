'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams();
  const locale = params.locale as string;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">⚠️</div>
        <h1 className="text-4xl font-bold mb-4">Something went wrong!</h1>
        <p className="text-text-secondary mb-8">
          We encountered an error while loading this page.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="gradient-team px-6 py-3 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Try again
          </button>
          <Link
            href={`/${locale}`}
            className="bg-background-card px-6 py-3 rounded-lg font-semibold hover:bg-background-light transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}