'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Home() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('landing');

  useEffect(() => {
    const savedTeam = localStorage.getItem('selectedTeam');
    if (savedTeam) {
      router.push(`/${locale}/team/${savedTeam}`);
    }
  }, [router, locale]);

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        <div className="mb-6 text-7xl">⚽</div>

        <h1 className="text-6xl font-bold mb-4">{t('title')}</h1>

        <p className="text-text-secondary text-xl mb-8">{t('description')}</p>

        <Link
          href={`/${locale}/select-team`}
          className="gradient-team inline-block px-8 py-4 rounded-xl font-semibold text-white text-lg hover:opacity-90 transition-opacity"
        >
          {t('chooseTeam')} →
        </Link>

        <div className="mt-12 flex justify-center gap-8 text-text-muted text-sm">
          <div>
            <div className="text-2xl font-bold text-text-primary">150+</div>
            <div>{t('stats.teams')}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-text-primary">4</div>
            <div>{t('stats.languages')}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-text-primary">24/7</div>
            <div>{t('stats.updates')}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
