'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { getTeamById } from '@/data/teams';
import { getPlayersByTeam, getPlayersByPosition } from '@/data/players';
import { Player } from '@/lib/types/player';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

export default function PlayersPage() {
  const params = useParams();
  const locale = params.locale as string;
  const teamId = params.teamId as string;
  const team = getTeamById(teamId);
  const [positionFilter, setPositionFilter] = useState<'all' | Player['position']>('all');
  const t = useTranslations('players');
  const tCommon = useTranslations('common');

  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">{tCommon('teamNotFound')}</h1>
          <Link href={`/${locale}/select-team`} className="text-team-primary hover:underline">
            {tCommon('changeTeam')}
          </Link>
        </div>
      </div>
    );
  }

  const allPlayers = getPlayersByTeam(teamId);
  const displayPlayers =
    positionFilter === 'all' ? allPlayers : getPlayersByPosition(teamId, positionFilter);

  const getPositionColor = (position: Player['position']) => {
    switch (position) {
      case 'GK':
        return 'bg-status-warning text-white';
      case 'DEF':
        return 'bg-status-info text-white';
      case 'MID':
        return 'bg-status-success text-white';
      case 'FWD':
        return 'bg-status-danger text-white';
    }
  };

  const getPositionName = (position: Player['position']) => {
    switch (position) {
      case 'GK':
        return t('positions.goalkeeper');
      case 'DEF':
        return t('positions.defender');
      case 'MID':
        return t('positions.midfielder');
      case 'FWD':
        return t('positions.forward');
    }
  };

  return (
    <main className="min-h-screen pb-8">
      <div className="gradient-team text-white">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="absolute top-6 end-6">
            <LanguageSwitcher />
          </div>
          <Link
            href={`/${locale}/team/${teamId}`}
            className="inline-flex items-center gap-2 mb-6 opacity-90 hover:opacity-100 transition-opacity"
          >
            <ArrowLeft size={20} />
            {tCommon('backToDashboard')}
          </Link>

          <h1 className="text-4xl font-bold">{t('title')}</h1>
          <p className="text-lg opacity-90 mt-2">
            {allPlayers.length} {t('subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setPositionFilter('all')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              positionFilter === 'all'
                ? 'bg-team-primary text-white'
                : 'bg-background-card text-text-secondary hover:bg-background-light'
            }`}
          >
            {t('filters.all')}
          </button>
          <button
            onClick={() => setPositionFilter('GK')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              positionFilter === 'GK'
                ? 'bg-team-primary text-white'
                : 'bg-background-card text-text-secondary hover:bg-background-light'
            }`}
          >
            {t('filters.goalkeepers')}
          </button>
          <button
            onClick={() => setPositionFilter('DEF')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              positionFilter === 'DEF'
                ? 'bg-team-primary text-white'
                : 'bg-background-card text-text-secondary hover:bg-background-light'
            }`}
          >
            {t('filters.defenders')}
          </button>
          <button
            onClick={() => setPositionFilter('MID')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              positionFilter === 'MID'
                ? 'bg-team-primary text-white'
                : 'bg-background-card text-text-secondary hover:bg-background-light'
            }`}
          >
            {t('filters.midfielders')}
          </button>
          <button
            onClick={() => setPositionFilter('FWD')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              positionFilter === 'FWD'
                ? 'bg-team-primary text-white'
                : 'bg-background-card text-text-secondary hover:bg-background-light'
            }`}
          >
            {t('filters.forwards')}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayPlayers.map((player) => (
            <div
              key={player.id}
              className="bg-background-card rounded-xl p-6 hover:bg-background-light transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-3xl font-bold text-team-primary mb-2">#{player.number}</div>
                  <span
                    className={`${getPositionColor(
                      player.position
                    )} text-xs px-3 py-1 rounded-full font-semibold`}
                  >
                    {player.position}
                  </span>
                </div>
                <div className="text-4xl">{team.flag}</div>
              </div>

              <h3 className="font-bold text-xl mb-1">{player.name}</h3>

              <div className="text-sm text-text-muted mb-4 space-y-1">
                <div className="flex items-center gap-2">
                  <span>🏟️</span>
                  <span>{player.club}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📅</span>
                  <span>{player.age} {t('yearsOld')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>⚽</span>
                  <span>{getPositionName(player.position)}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-background-light">
                <div className="text-center">
                  <div className="font-bold text-xl text-team-primary">
                    {player.stats.appearances}
                  </div>
                  <div className="text-xs text-text-muted uppercase">{t('stats.apps')}</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-xl text-team-primary">{player.stats.goals}</div>
                  <div className="text-xs text-text-muted uppercase">{t('stats.goals')}</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-xl text-team-primary">{player.stats.assists}</div>
                  <div className="text-xs text-text-muted uppercase">{t('stats.assists')}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {displayPlayers.length === 0 && (
          <div className="text-center py-12 text-text-muted">
            {t('noPlayers')}
          </div>
        )}
      </div>
    </main>
  );
}
