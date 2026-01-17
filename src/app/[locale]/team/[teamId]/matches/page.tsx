'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { getTeamById } from '@/data/teams';
import { getMatchesByTeam, getUpcomingMatches, getRecentMatches } from '@/data/matches';
import { ArrowLeft, Calendar, MapPin, Trophy } from 'lucide-react';

export default function MatchesPage() {
  const params = useParams();
  const teamId = params.teamId as string;
  const team = getTeamById(teamId);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'recent'>('all');

  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Team Not Found</h1>
          <Link href="/select-team" className="text-team-primary hover:underline">
            Choose a different team
          </Link>
        </div>
      </div>
    );
  }

  const allMatches = getMatchesByTeam(teamId);
  const upcomingMatches = getUpcomingMatches(teamId);
  const recentMatches = getRecentMatches(teamId);

  const displayMatches =
    filter === 'upcoming' ? upcomingMatches : filter === 'recent' ? recentMatches : allMatches;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <main className="min-h-screen pb-8">
      <div className="gradient-team text-white">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Link
            href={`/team/${teamId}`}
            className="inline-flex items-center gap-2 mb-6 opacity-90 hover:opacity-100 transition-opacity"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>

          <h1 className="text-4xl font-bold">Matches</h1>
          <p className="text-lg opacity-90 mt-2">{team.name} fixture schedule</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex gap-3 mb-6 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-team-primary text-white'
                : 'bg-background-card text-text-secondary hover:bg-background-light'
            }`}
          >
            All Matches
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              filter === 'upcoming'
                ? 'bg-team-primary text-white'
                : 'bg-background-card text-text-secondary hover:bg-background-light'
            }`}
          >
            Upcoming ({upcomingMatches.length})
          </button>
          <button
            onClick={() => setFilter('recent')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              filter === 'recent'
                ? 'bg-team-primary text-white'
                : 'bg-background-card text-text-secondary hover:bg-background-light'
            }`}
          >
            Recent ({recentMatches.length})
          </button>
        </div>

        <div className="space-y-4">
          {displayMatches.map((match) => (
            <div
              key={match.id}
              className="bg-background-card hover:bg-background-light rounded-xl p-6 transition-colors"
            >
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="text-sm text-text-muted flex items-center gap-1">
                  <Calendar size={16} />
                  {formatDate(match.date)} • {match.time}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    match.status === 'upcoming'
                      ? 'bg-status-info text-white'
                      : match.status === 'live'
                      ? 'bg-status-danger text-white'
                      : 'bg-status-success text-white'
                  }`}
                >
                  {match.status === 'upcoming'
                    ? 'Upcoming'
                    : match.status === 'live'
                    ? 'Live'
                    : 'Full Time'}
                </span>
              </div>

              <div className="flex items-center justify-between mb-4 gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="text-4xl shrink-0">{team.flag}</div>
                  <div className="min-w-0">
                    <div className="font-bold text-lg truncate">{team.name}</div>
                    <div className="text-sm text-text-muted">{match.isHome ? 'Home' : 'Away'}</div>
                  </div>
                </div>

                {match.status === 'finished' && match.score ? (
                  <div className="text-3xl font-bold text-team-primary shrink-0">
                    {match.isHome
                      ? `${match.score.home} - ${match.score.away}`
                      : `${match.score.away} - ${match.score.home}`}
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-text-muted shrink-0">VS</div>
                )}

                <div className="flex items-center gap-4 flex-1 justify-end min-w-0">
                  <div className="text-right min-w-0">
                    <div className="font-bold text-lg truncate">{match.opponent}</div>
                    <div className="text-sm text-text-muted">{match.isHome ? 'Away' : 'Home'}</div>
                  </div>
                  <div className="text-4xl shrink-0">{match.opponentFlag}</div>
                </div>
              </div>

              <div className="flex gap-4 text-sm text-text-muted flex-wrap">
                <span className="flex items-center gap-1">
                  <Trophy size={16} />
                  {match.competition}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={16} />
                  {match.venue}
                </span>
              </div>
            </div>
          ))}
        </div>

        {displayMatches.length === 0 && (
          <div className="text-center py-12 text-text-muted">No matches found.</div>
        )}
      </div>
    </main>
  );
}
