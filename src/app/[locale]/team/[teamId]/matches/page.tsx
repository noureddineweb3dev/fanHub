'use client';

import { useParams } from 'next/navigation';
import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { getTeamById } from '@/data/teams';
import { getMatchesByTeam, getUpcomingMatches, getRecentMatches } from '@/data/matches';
import { ArrowLeft, Calendar, MapPin, Trophy, Clock, Home, Plane } from 'lucide-react';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

type FilterType = 'all' | 'upcoming' | 'recent';

export default function MatchesPage() {
  const params = useParams();
  const locale = params.locale as string;
  const teamId = params.teamId as string;
  const team = getTeamById(teamId);
  const [filter, setFilter] = useState<FilterType>('all');
  const t = useTranslations('matches');
  const tCommon = useTranslations('common');

  const allMatches = useMemo(() => getMatchesByTeam(teamId), [teamId]);
  const upcomingMatches = useMemo(() => getUpcomingMatches(teamId), [teamId]);
  const recentMatches = useMemo(() => getRecentMatches(teamId), [teamId]);

  const displayMatches = useMemo(() => {
    if (filter === 'upcoming') return upcomingMatches;
    if (filter === 'recent') return recentMatches;
    return allMatches;
  }, [filter, allMatches, upcomingMatches, recentMatches]);

  const formatDate = useCallback((dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }, []);

  const formatShortDate = useCallback((dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }, []);

  const handleFilterChange = useCallback((newFilter: FilterType) => {
    setFilter(newFilter);
  }, []);

  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-background-card/30">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">⚠️</div>
          <h1 className="text-2xl font-bold mb-2 text-text-primary">{tCommon('teamNotFound') || 'Team Not Found'}</h1>
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-background-card/30 pb-8">
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
            href={`/${locale}/team/${teamId}`}
            className="inline-flex items-center gap-2 mb-6 opacity-90 hover:opacity-100 transition-all duration-200 hover:scale-105 group"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="font-medium">{tCommon('backToDashboard') || 'Back to Dashboard'}</span>
          </Link>

          <div className="flex items-center gap-4 mb-2">
            <div className="text-5xl sm:text-6xl filter drop-shadow-lg">{team.flag}</div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-1 drop-shadow-lg">
                {t('title') || 'Matches'}
              </h1>
              <p className="text-base sm:text-lg opacity-90">
                {team.name} {t('subtitle') || 'matches'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center sm:justify-start">
          <button
            onClick={() => handleFilterChange('all')}
            className={`group relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              filter === 'all'
                ? 'bg-gradient-to-r from-team-primary to-purple-500 text-white shadow-lg shadow-team-primary/30 scale-105'
                : 'bg-background-card/90 backdrop-blur-sm text-text-secondary hover:bg-background-light border border-background-light hover:border-team-primary/50 hover:scale-102'
            }`}
          >
            <span className="relative z-10">{t('filters.all') || 'All Matches'}</span>
            {filter === 'all' && (
              <span className="absolute inset-0 bg-gradient-to-r from-team-primary to-purple-500 rounded-xl blur-xl opacity-50 -z-0" />
            )}
          </button>
          <button
            onClick={() => handleFilterChange('upcoming')}
            className={`group relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              filter === 'upcoming'
                ? 'bg-gradient-to-r from-team-primary to-purple-500 text-white shadow-lg shadow-team-primary/30 scale-105'
                : 'bg-background-card/90 backdrop-blur-sm text-text-secondary hover:bg-background-light border border-background-light hover:border-team-primary/50 hover:scale-102'
            }`}
          >
            <span className="relative z-10 flex items-center gap-2">
              {t('filters.upcoming') || 'Upcoming'}
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
                {upcomingMatches.length}
              </span>
            </span>
            {filter === 'upcoming' && (
              <span className="absolute inset-0 bg-gradient-to-r from-team-primary to-purple-500 rounded-xl blur-xl opacity-50 -z-0" />
            )}
          </button>
          <button
            onClick={() => handleFilterChange('recent')}
            className={`group relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              filter === 'recent'
                ? 'bg-gradient-to-r from-team-primary to-purple-500 text-white shadow-lg shadow-team-primary/30 scale-105'
                : 'bg-background-card/90 backdrop-blur-sm text-text-secondary hover:bg-background-light border border-background-light hover:border-team-primary/50 hover:scale-102'
            }`}
          >
            <span className="relative z-10 flex items-center gap-2">
              {t('filters.recent') || 'Recent'}
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
                {recentMatches.length}
              </span>
            </span>
            {filter === 'recent' && (
              <span className="absolute inset-0 bg-gradient-to-r from-team-primary to-purple-500 rounded-xl blur-xl opacity-50 -z-0" />
            )}
          </button>
        </div>

        {/* Matches List */}
        {displayMatches.length > 0 ? (
          <div className="space-y-4 sm:space-y-6">
            {displayMatches.map((match, index) => {
              const teamScore = match.status === 'finished' && match.score
                ? (match.isHome ? match.score.home : match.score.away)
                : null;
              const opponentScore = match.status === 'finished' && match.score
                ? (match.isHome ? match.score.away : match.score.home)
                : null;
              const isWin = match.status === 'finished' && teamScore !== null && opponentScore !== null
                ? teamScore > opponentScore
                : null;
              const isDraw = match.status === 'finished' && teamScore !== null && opponentScore !== null
                ? teamScore === opponentScore
                : null;

              return (
                <div
                  key={match.id}
                  className="group relative bg-background-card/90 backdrop-blur-md hover:bg-background-card border-2 border-background-light hover:border-team-primary/60 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-team-primary/20 animate-fade-in-up overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${team.colors.primary}22, ${team.colors.secondary}22)`,
                    }}
                  />

                  {/* Header with date and status */}
                  <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-2 text-sm text-text-muted">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">{formatShortDate(match.date)}</span>
                        <span>•</span>
                        <Clock className="w-4 h-4" />
                        <span>{match.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      {match.isHome ? (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-status-success/20 text-status-success flex items-center gap-1.5">
                          <Home className="w-3 h-3" />
                          {t('home') || 'Home'}
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-status-warning/20 text-status-warning flex items-center gap-1.5">
                          <Plane className="w-3 h-3" />
                          {t('away') || 'Away'}
                        </span>
                      )}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          match.status === 'upcoming'
                            ? 'bg-status-info/20 text-status-info'
                            : match.status === 'live'
                            ? 'bg-status-danger/20 text-status-danger animate-pulse'
                            : 'bg-status-success/20 text-status-success'
                        }`}
                      >
                        {match.status === 'upcoming'
                          ? t('status.upcoming') || 'Upcoming'
                          : match.status === 'live'
                          ? t('status.live') || 'Live'
                          : t('status.finished') || 'Finished'}
                      </span>
                    </div>
                  </div>

                  {/* Match teams and score */}
                  <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
                    {/* Team */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="text-5xl sm:text-6xl transform group-hover:scale-110 transition-transform shrink-0 filter drop-shadow-lg">
                        {team.flag}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-lg sm:text-xl text-text-primary truncate">{team.name}</div>
                        <div className="text-xs sm:text-sm text-text-muted mt-1">{formatDate(match.date)}</div>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="flex items-center gap-4 sm:gap-6">
                      {match.status === 'finished' && match.score ? (
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className={`text-3xl sm:text-4xl font-bold ${
                            isWin ? 'text-status-success' : isDraw ? 'text-status-warning' : 'text-status-danger'
                          }`}>
                            {match.isHome ? match.score.home : match.score.away}
                          </div>
                          <div className="text-xl sm:text-2xl font-bold text-text-muted">-</div>
                          <div className={`text-3xl sm:text-4xl font-bold ${
                            isWin ? 'text-status-danger' : isDraw ? 'text-status-warning' : 'text-status-success'
                          }`}>
                            {match.isHome ? match.score.away : match.score.home}
                          </div>
                        </div>
                      ) : (
                        <div className="text-2xl sm:text-3xl font-bold text-team-primary">{t('vs') || 'VS'}</div>
                      )}
                    </div>

                    {/* Opponent */}
                    <div className="flex items-center gap-4 flex-1 justify-end min-w-0">
                      <div className="text-end min-w-0">
                        <div className="font-bold text-lg sm:text-xl text-text-primary truncate">{match.opponent}</div>
                        <div className="text-xs sm:text-sm text-text-muted mt-1">{match.venue}</div>
                      </div>
                      <div className="text-5xl sm:text-6xl transform group-hover:scale-110 transition-transform shrink-0 filter drop-shadow-lg">
                        {match.opponentFlag}
                      </div>
                    </div>
                  </div>

                  {/* Footer with competition and venue */}
                  <div className="relative z-10 flex flex-wrap items-center gap-4 text-sm text-text-muted pt-4 border-t border-background-light">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-team-primary" />
                      <span className="font-medium">{match.competition}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-team-primary" />
                      <span className="font-medium">{match.venue}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="text-7xl mb-6 animate-bounce">⚽</div>
              <h3 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
                {t('noMatches') || 'No matches found'}
              </h3>
              <p className="text-text-muted text-lg leading-relaxed">
                {filter === 'upcoming'
                  ? 'There are no upcoming matches scheduled at the moment.'
                  : filter === 'recent'
                  ? 'There are no recent matches to display.'
                  : 'No matches available for this team.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
