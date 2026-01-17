'use client';

import { useParams } from 'next/navigation';
import { getTeamById } from '@/data/teams';
import Link from 'next/link';
import { ArrowLeft, Trophy, Users, Newspaper, Video } from 'lucide-react';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

export default function TeamDashboardPage() {
  const params = useParams();
  const locale = params.locale as string;
  const teamId = params.teamId as string;
  const team = getTeamById(teamId);
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');

  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-2">Team Not Found</h1>
          <Link href={`/${locale}/select-team`} className="text-team-primary hover:underline">
            {tCommon('changeTeam')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="gradient-team text-white">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="absolute top-6 end-6">
            <LanguageSwitcher />
          </div>
          <Link
            href={`/${locale}/select-team`}
            className="inline-flex items-center gap-2 mb-6 opacity-90 hover:opacity-100 transition-opacity"
          >
            <ArrowLeft size={20} />
            {tCommon('changeTeam')}
          </Link>

          <div className="flex items-center gap-6 mb-6">
            <div className="text-7xl">{team.flag}</div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{team.name}</h1>
              <p className="text-lg opacity-90">
                {team.type === 'national' ? team.country : team.league}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-background-card rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-status-success mb-1">12</div>
            <div className="text-sm text-text-muted uppercase tracking-wide">{t('stats.wins')}</div>
          </div>
          <div className="bg-background-card rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-status-warning mb-1">5</div>
            <div className="text-sm text-text-muted uppercase tracking-wide">
              {t('stats.draws')}
            </div>
          </div>
          <div className="bg-background-card rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-status-danger mb-1">3</div>
            <div className="text-sm text-text-muted uppercase tracking-wide">
              {t('stats.losses')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href={`/${locale}/team/${team.id}/matches`}
            className="bg-background-card hover:bg-background-light rounded-xl p-6 text-center transition-colors group"
          >
            <Trophy
              className="mx-auto mb-3 text-team-primary group-hover:scale-110 transition-transform"
              size={32}
            />
            <div className="font-semibold">{t('navigation.matches')}</div>
          </Link>

          <Link
            href={`/${locale}/team/${team.id}/players`}
            className="bg-background-card hover:bg-background-light rounded-xl p-6 text-center transition-colors group"
          >
            <Users
              className="mx-auto mb-3 text-team-primary group-hover:scale-110 transition-transform"
              size={32}
            />
            <div className="font-semibold">{t('navigation.squad')}</div>
          </Link>

          <Link
            href={`/${locale}/team/${team.id}/news`}
            className="bg-background-card hover:bg-background-light rounded-xl p-6 text-center transition-colors group"
          >
            <Newspaper
              className="mx-auto mb-3 text-team-primary group-hover:scale-110 transition-transform"
              size={32}
            />
            <div className="font-semibold">{t('navigation.news')}</div>
          </Link>

          <Link
            href={`/${locale}/team/${team.id}/reactions`}
            className="bg-background-card hover:bg-background-light rounded-xl p-6 text-center transition-colors group"
          >
            <Video
              className="mx-auto mb-3 text-team-primary group-hover:scale-110 transition-transform"
              size={32}
            />
            <div className="font-semibold">{t('navigation.videos')}</div>
          </Link>
        </div>

        <div className="mt-8 bg-background-card rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">{t('nextMatch')}</h2>
          <div className="bg-background-light rounded-lg p-4">
            <div className="text-sm text-text-muted mb-3">📅 January 20, 2026 • 20:00 GMT</div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{team.flag}</div>
                <div className="font-semibold">{team.name}</div>
              </div>
              <div className="text-xl font-bold text-team-primary">{t('vs')}</div>
              <div className="flex items-center gap-3">
                <div className="font-semibold">{t('tbd')}</div>
                <div className="text-3xl">⚽</div>
              </div>
            </div>
            <div className="text-sm text-text-muted flex gap-4">
              <span>🏆 {t('upcomingCompetition')}</span>
              <span>🏟️ {t('tbdStadium')}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
