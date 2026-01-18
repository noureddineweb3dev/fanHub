import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">404</div>
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-text-secondary mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link
          href="/"
          className="gradient-team inline-block px-6 py-3 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}