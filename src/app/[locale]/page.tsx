'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const savedTeam = localStorage.getItem('selectedTeam');
    if (savedTeam) {
      router.push(`/team/${savedTeam}`);
    }
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        <div className="mb-6 text-7xl">⚽</div>

        <h1 className="text-6xl font-bold mb-4">FanHub</h1>

        <p className="text-text-secondary text-xl mb-8">
          Track any football team in the world. Get live matches, news, player stats, and fan
          reactions all in one place.
        </p>

        <Link
          href="/select-team"
          className="gradient-team inline-block px-8 py-4 rounded-xl font-semibold text-white text-lg hover:opacity-90 transition-opacity"
        >
          Choose Your Team →
        </Link>

        <div className="mt-12 flex justify-center gap-8 text-text-muted text-sm">
          <div>
            <div className="text-2xl font-bold text-text-primary">150+</div>
            <div>Teams</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-text-primary">4</div>
            <div>Languages</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-text-primary">24/7</div>
            <div>Updates</div>
          </div>
        </div>
      </div>
    </main>
  );
}
