'use client';

import { useParams } from 'next/navigation';
import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { getTeamById } from '@/data/teams';
import { getPlayersByTeam, getPlayersByPosition } from '@/data/players';
import { Player } from '@/lib/types/player';
import { ArrowLeft, Users, Shield, Target, Zap, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

type PositionFilter = 'all' | Player['position'];

export default function PlayersPage() {
  const params = useParams();
  const locale = params.locale as string;
  const teamId = params.teamId as string;
  const team = getTeamById(teamId);
  const [positionFilter, setPositionFilter] = useState<PositionFilter>('all');
  const t = useTranslations('players');
  const tCommon = useTranslations('common');

  const allPlayers = useMemo(() => getPlayersByTeam(teamId), [teamId]);
  const displayPlayers = useMemo(() => {
    return positionFilter === 'all' ? allPlayers : getPlayersByPosition(teamId, positionFilter);
  }, [teamId, positionFilter, allPlayers]);

  const getPositionColor = useCallback((position: Player['position']) => {
    switch (position) {
      case 'GK':
        return 'bg-status-warning/20 text-status-warning border-status-warning/30';
      case 'DEF':
        return 'bg-status-info/20 text-status-info border-status-info/30';
      case 'MID':
        return 'bg-status-success/20 text-status-success border-status-success/30';
      case 'FWD':
        return 'bg-status-danger/20 text-status-danger border-status-danger/30';
    }
  }, []);

  const getPositionIcon = useCallback((position: Player['position']) => {
    switch (position) {
      case 'GK':
        return Shield;
      case 'DEF':
        return Shield;
      case 'MID':
        return Target;
      case 'FWD':
        return Zap;
      default:
        return User;
    }
  }, []);

  const getPositionName = useCallback((position: Player['position']) => {
    switch (position) {
      case 'GK':
        return t('positions.goalkeeper') || 'Goalkeeper';
      case 'DEF':
        return t('positions.defender') || 'Defender';
      case 'MID':
        return t('positions.midfielder') || 'Midfielder';
      case 'FWD':
        return t('positions.forward') || 'Forward';
    }
  }, [t]);

  const handleFilterChange = useCallback((filter: PositionFilter) => {
    setPositionFilter(filter);
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

  const positionFilters = [
    { id: 'all' as PositionFilter, label: t('filters.all') || 'All', icon: Users },
    { id: 'GK' as PositionFilter, label: t('filters.goalkeepers') || 'Goalkeepers', icon: Shield },
    { id: 'DEF' as PositionFilter, label: t('filters.defenders') || 'Defenders', icon: Shield },
    { id: 'MID' as PositionFilter, label: t('filters.midfielders') || 'Midfielders', icon: Target },
    { id: 'FWD' as PositionFilter, label: t('filters.forwards') || 'Forwards', icon: Zap },
  ];

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
            <Users className="w-8 h-8 sm:w-10 sm:h-10 filter drop-shadow-lg" />
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-1 drop-shadow-lg">
                {t('title') || 'Players'}
              </h1>
              <p className="text-base sm:text-lg opacity-90">
                {allPlayers.length} {t('subtitle') || 'players in squad'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center sm:justify-start">
          {positionFilters.map((filter) => {
            const Icon = filter.icon;
            const isActive = positionFilter === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => handleFilterChange(filter.id)}
                className={`group relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-team-primary to-purple-500 text-white shadow-lg shadow-team-primary/30 scale-105'
                    : 'bg-background-card/90 backdrop-blur-sm text-text-secondary hover:bg-background-light border border-background-light hover:border-team-primary/50 hover:scale-102'
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className={`w-4 h-4 transition-transform ${isActive ? 'scale-110' : ''}`} />
                  {filter.label}
                </span>
                {isActive && (
                  <span className="absolute inset-0 bg-gradient-to-r from-team-primary to-purple-500 rounded-xl blur-xl opacity-50 -z-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Players Grid */}
        {displayPlayers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {displayPlayers.map((player, index) => {
              const PositionIcon = getPositionIcon(player.position);
              return (
                <div
                  key={player.id}
                  className="group relative bg-background-card/90 backdrop-blur-md hover:bg-background-card border-2 border-background-light hover:border-team-primary/60 rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-team-primary/20 animate-fade-in-up overflow-hidden"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${team.colors.primary}22, ${team.colors.secondary}22)`,
                    }}
                  />

                  {/* Header */}
                  <div className="relative z-10 flex items-start justify-between mb-4">
                    <div>
                      <div className="text-4xl sm:text-5xl font-bold text-team-primary mb-2 drop-shadow-lg">
                        #{player.number}
                      </div>
                      <span
                        className={`${getPositionColor(player.position)} border-2 text-xs px-3 py-1.5 rounded-full font-semibold flex items-center gap-1.5 w-fit`}
                      >
                        <PositionIcon className="w-3 h-3" />
                        {player.position}
                      </span>
                    </div>
                    <div className="text-5xl sm:text-6xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 filter drop-shadow-lg">
                      {team.flag}
                    </div>
                  </div>

                  {/* Player Name */}
                  <h3 className="relative z-10 font-bold text-xl sm:text-2xl mb-4 text-text-primary group-hover:text-team-primary transition-colors">
                    {player.name}
                  </h3>

                  {/* Player Info */}
                  <div className="relative z-10 text-sm text-text-muted mb-6 space-y-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🏟️</span>
                      <span className="font-medium">{player.club}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📅</span>
                      <span>{player.age} {t('yearsOld') || 'years old'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PositionIcon className="w-4 h-4" />
                      <span>{getPositionName(player.position)}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="relative z-10 grid grid-cols-3 gap-3 pt-4 border-t border-background-light">
                    <div className="text-center group/stat">
                      <div className="font-bold text-xl sm:text-2xl text-team-primary mb-1 group-hover/stat:scale-110 transition-transform">
                        {player.stats.appearances}
                      </div>
                      <div className="text-xs text-text-muted uppercase tracking-wide font-medium">
                        {t('stats.apps') || 'Apps'}
                      </div>
                    </div>
                    <div className="text-center group/stat">
                      <div className="font-bold text-xl sm:text-2xl text-team-primary mb-1 group-hover/stat:scale-110 transition-transform">
                        {player.stats.goals}
                      </div>
                      <div className="text-xs text-text-muted uppercase tracking-wide font-medium">
                        {t('stats.goals') || 'Goals'}
                      </div>
                    </div>
                    <div className="text-center group/stat">
                      <div className="font-bold text-xl sm:text-2xl text-team-primary mb-1 group-hover/stat:scale-110 transition-transform">
                        {player.stats.assists}
                      </div>
                      <div className="text-xs text-text-muted uppercase tracking-wide font-medium">
                        {t('stats.assists') || 'Assists'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="text-7xl mb-6 animate-bounce">👤</div>
              <h3 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
                {t('noPlayers') || 'No players found'}
              </h3>
              <p className="text-text-muted text-lg leading-relaxed">
                {positionFilter === 'all'
                  ? 'No players available for this team.'
                  : `No ${getPositionName(positionFilter)} available for this team.`}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
