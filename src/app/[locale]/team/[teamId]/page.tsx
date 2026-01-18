'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { getTeamById } from '@/data/teams';
import { getMatchesByTeam, getUpcomingMatches, getRecentMatches } from '@/data/matches';
import Link from 'next/link';
import {
  ArrowLeft,
  Trophy,
  Users,
  Newspaper,
  Video,
  Calendar,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

export default function TeamDashboardPage() {
  const params = useParams();
  const locale = params.locale as string;
  const teamId = params.teamId as string;
  const team = getTeamById(teamId);
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');

  const matches = useMemo(() => getMatchesByTeam(teamId), [teamId]);
  const upcomingMatches = useMemo(() => getUpcomingMatches(teamId), [teamId]);
  const recentMatches = useMemo(() => getRecentMatches(teamId), [teamId]);
  const nextMatch = upcomingMatches[0];

  const stats = useMemo(() => {
    const finishedMatches = matches.filter((m) => m.status === 'finished' && m.score);
    let wins = 0;
    let draws = 0;
    let losses = 0;

    finishedMatches.forEach((match) => {
      if (!match.score) return;
      const teamScore = match.isHome ? match.score.home : match.score.away;
      const opponentScore = match.isHome ? match.score.away : match.score.home;

      if (teamScore > opponentScore) wins++;
      else if (teamScore === opponentScore) draws++;
      else losses++;
    });

    return { wins, draws, losses, total: wins + draws + losses };
  }, [matches]);

  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-background-card/30">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">⚠️</div>
          <h1 className="text-2xl font-bold mb-2 text-text-primary">Team Not Found</h1>
          <Link
            href={`/${locale}/select-team`}
            className="inline-flex items-center gap-2 text-team-primary hover:underline transition-all duration-200 hover:scale-105"
          >
            {tCommon('changeTeam')}
          </Link>
        </div>
      </div>
    );
  }

  const teamGradient = `linear-gradient(135deg, ${team.colors.primary} 0%, ${team.colors.secondary} 100%)`;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-background-card/30">
      {/* Header with team colors */}
      <div
        className="relative text-white overflow-hidden"
        style={{
          background: teamGradient,
        }}
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${team.colors.primary}44, ${team.colors.secondary}44)` }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="absolute top-6 end-6 z-10">
            <LanguageSwitcher />
          </div>

          <Link
            href={`/${locale}/select-team`}
            className="inline-flex items-center gap-2 mb-6 opacity-90 hover:opacity-100 transition-all duration-200 hover:scale-105 group"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="font-medium">{tCommon('changeTeam')}</span>
          </Link>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
            <div
              className="text-8xl sm:text-9xl transform hover:scale-110 hover:rotate-6 transition-all duration-300 filter drop-shadow-2xl"
              style={{ animationDelay: '0.1s' }}
            >
              {team.flag}
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-2 drop-shadow-lg">
                {team.name}
              </h1>
              <p className="text-lg sm:text-xl opacity-90 flex items-center gap-2">
                <span>{team.type === 'national' ? team.country : team.league}</span>
                {team.type === 'club' && team.country && (
                  <>
                    <span>•</span>
                    <span>{team.country}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Team colors bar */}
          <div className="flex gap-2 mt-6">
            <div
              className="h-2 flex-1 rounded-full shadow-lg transform hover:scale-105 transition-transform"
              style={{ backgroundColor: team.colors.primary }}
            />
            <div
              className="h-2 flex-1 rounded-full shadow-lg transform hover:scale-105 transition-transform"
              style={{ backgroundColor: team.colors.secondary }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="bg-background-card/90 backdrop-blur-md hover:bg-background-card border-2 border-background-light hover:border-status-success/50 rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-status-success/20 animate-fade-in-up">
            <div className="text-3xl sm:text-4xl font-bold text-status-success mb-2">{stats.wins}</div>
            <div className="text-xs sm:text-sm text-text-muted uppercase tracking-wide font-medium">
              {t('stats.wins')}
            </div>
          </div>
          <div className="bg-background-card/90 backdrop-blur-md hover:bg-background-card border-2 border-background-light hover:border-status-warning/50 rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-status-warning/20 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="text-3xl sm:text-4xl font-bold text-status-warning mb-2">{stats.draws}</div>
            <div className="text-xs sm:text-sm text-text-muted uppercase tracking-wide font-medium">
              {t('stats.draws')}
            </div>
          </div>
          <div className="bg-background-card/90 backdrop-blur-md hover:bg-background-card border-2 border-background-light hover:border-status-danger/50 rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-status-danger/20 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="text-3xl sm:text-4xl font-bold text-status-danger mb-2">{stats.losses}</div>
            <div className="text-xs sm:text-sm text-text-muted uppercase tracking-wide font-medium">
              {t('stats.losses')}
            </div>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Link
            href={`/${locale}/team/${team.id}/matches`}
            className="group relative bg-background-card/90 backdrop-blur-md hover:bg-background-card border-2 border-background-light hover:border-team-primary/60 rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-team-primary/20 animate-fade-in-up overflow-hidden"
            style={{ animationDelay: '0.3s' }}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
              style={{
                background: `linear-gradient(135deg, ${team.colors.primary}22, ${team.colors.secondary}22)`,
              }}
            />
            <Trophy
              className="relative z-10 mx-auto mb-3 text-team-primary group-hover:scale-110 transition-transform duration-300"
              size={32}
            />
            <div className="relative z-10 font-semibold text-text-primary">{t('navigation.matches')}</div>
          </Link>

          <Link
            href={`/${locale}/team/${team.id}/players`}
            className="group relative bg-background-card/90 backdrop-blur-md hover:bg-background-card border-2 border-background-light hover:border-team-primary/60 rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-team-primary/20 animate-fade-in-up overflow-hidden"
            style={{ animationDelay: '0.4s' }}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
              style={{
                background: `linear-gradient(135deg, ${team.colors.primary}22, ${team.colors.secondary}22)`,
              }}
            />
            <Users
              className="relative z-10 mx-auto mb-3 text-team-primary group-hover:scale-110 transition-transform duration-300"
              size={32}
            />
            <div className="relative z-10 font-semibold text-text-primary">{t('navigation.squad')}</div>
          </Link>

          <Link
            href={`/${locale}/team/${team.id}/news`}
            className="group relative bg-background-card/90 backdrop-blur-md hover:bg-background-card border-2 border-background-light hover:border-team-primary/60 rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-team-primary/20 animate-fade-in-up overflow-hidden"
            style={{ animationDelay: '0.5s' }}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
              style={{
                background: `linear-gradient(135deg, ${team.colors.primary}22, ${team.colors.secondary}22)`,
              }}
            />
            <Newspaper
              className="relative z-10 mx-auto mb-3 text-team-primary group-hover:scale-110 transition-transform duration-300"
              size={32}
            />
            <div className="relative z-10 font-semibold text-text-primary">{t('navigation.news')}</div>
          </Link>

          <Link
            href={`/${locale}/team/${team.id}/reactions`}
            className="group relative bg-background-card/90 backdrop-blur-md hover:bg-background-card border-2 border-background-light hover:border-team-primary/60 rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-team-primary/20 animate-fade-in-up overflow-hidden"
            style={{ animationDelay: '0.6s' }}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
              style={{
                background: `linear-gradient(135deg, ${team.colors.primary}22, ${team.colors.secondary}22)`,
              }}
            />
            <Video
              className="relative z-10 mx-auto mb-3 text-team-primary group-hover:scale-110 transition-transform duration-300"
              size={32}
            />
            <div className="relative z-10 font-semibold text-text-primary">{t('navigation.videos')}</div>
          </Link>
        </div>

        {/* Next Match Section */}
        {nextMatch && (
          <div className="mb-8 bg-background-card/90 backdrop-blur-md border-2 border-background-light hover:border-team-primary/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl animate-fade-in-up">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-team-primary" />
              <h2 className="text-xl sm:text-2xl font-bold text-text-primary">{t('nextMatch')}</h2>
            </div>
            <Link
              href={`/${locale}/team/${team.id}/matches`}
              className="block bg-background-light/50 hover:bg-background-light rounded-xl p-6 transition-all duration-300 hover:scale-[1.02] group"
            >
              <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(nextMatch.date)} • {nextMatch.time}</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="text-4xl sm:text-5xl transform group-hover:scale-110 transition-transform">
                    {team.flag}
                  </div>
                  <div className="font-bold text-lg sm:text-xl text-text-primary">{team.name}</div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-team-primary">{t('vs')}</div>
                <div className="flex items-center gap-4">
                  <div className="font-bold text-lg sm:text-xl text-text-primary">{nextMatch.opponent}</div>
                  <div className="text-4xl sm:text-5xl transform group-hover:scale-110 transition-transform">
                    {nextMatch.opponentFlag}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  <span>{nextMatch.competition}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{nextMatch.venue}</span>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    nextMatch.isHome
                      ? 'bg-status-success/20 text-status-success'
                      : 'bg-status-warning/20 text-status-warning'
                  }`}>
                    {nextMatch.isHome ? 'Home' : 'Away'}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Recent Matches Section */}
        {recentMatches.length > 0 && (
          <div className="bg-background-card/90 backdrop-blur-md border-2 border-background-light rounded-2xl p-6 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-team-primary" />
              <h2 className="text-xl sm:text-2xl font-bold text-text-primary">Recent Matches</h2>
            </div>
            <div className="space-y-4">
              {recentMatches.slice(0, 3).map((match, index) => (
                <Link
                  key={match.id}
                  href={`/${locale}/team/${team.id}/matches`}
                  className="block bg-background-light/50 hover:bg-background-light rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] group"
                  style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs sm:text-sm text-text-muted flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(match.date)}</span>
                      <span>•</span>
                      <span>{match.competition}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-2xl sm:text-3xl">{team.flag}</div>
                      <div className="font-semibold text-text-primary flex-1">{team.name}</div>
                      {match.score && (
                        <div className="font-bold text-lg sm:text-xl text-text-primary">
                          {match.isHome ? match.score.home : match.score.away}
                        </div>
                      )}
                    </div>
                    <div className="mx-4 text-text-muted">-</div>
                    <div className="flex items-center gap-3 flex-1 justify-end">
                      {match.score && (
                        <div className="font-bold text-lg sm:text-xl text-text-primary">
                          {match.isHome ? match.score.away : match.score.home}
                        </div>
                      )}
                      <div className="font-semibold text-text-primary flex-1 text-end">{match.opponent}</div>
                      <div className="text-2xl sm:text-3xl">{match.opponentFlag}</div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-text-muted flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    <span>{match.venue}</span>
                  </div>
                </Link>
              ))}
            </div>
            {recentMatches.length > 3 && (
              <Link
                href={`/${locale}/team/${team.id}/matches`}
                className="mt-6 block text-center text-team-primary hover:underline font-semibold transition-all duration-200 hover:scale-105"
              >
                View All Matches →
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
