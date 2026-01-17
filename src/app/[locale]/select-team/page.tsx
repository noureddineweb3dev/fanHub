'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { teams, getTeamsByType, searchTeams } from '@/data/teams';
import { Team } from '@/lib/types/team';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

export default function SelectTeamPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('teamSelection');
  const tCommon = useTranslations('common');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'national' | 'club'>('all');

  const filteredTeams = searchQuery
    ? searchTeams(searchQuery)
    : selectedTab === 'all'
    ? teams
    : getTeamsByType(selectedTab);

  const handleTeamSelect = (team: Team) => {
    localStorage.setItem('selectedTeam', team.id);
    router.push(`/${locale}/team/${team.id}`);
  };

  return (
    <main className="min-h-screen p-6 pb-24">
      <div className="max-w-4xl mx-auto">
        <div className="absolute top-6 end-6">
          <LanguageSwitcher />
        </div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
          <p className="text-text-secondary">{t('subtitle')}</p>
        </div>

        <div className="mb-6 relative">
          <Search className="absolute start-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background-card border border-background-light rounded-xl py-4 ps-12 pe-4 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-team-primary transition-colors"
          />
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setSelectedTab('all')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              selectedTab === 'all'
                ? 'bg-team-primary text-white'
                : 'bg-background-card text-text-secondary hover:bg-background-light'
            }`}
          >
            {t('tabs.all')}
          </button>
          <button
            onClick={() => setSelectedTab('national')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              selectedTab === 'national'
                ? 'bg-team-primary text-white'
                : 'bg-background-card text-text-secondary hover:bg-background-light'
            }`}
          >
            {t('tabs.national')}
          </button>
          <button
            onClick={() => setSelectedTab('club')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              selectedTab === 'club'
                ? 'bg-team-primary text-white'
                : 'bg-background-card text-text-secondary hover:bg-background-light'
            }`}
          >
            {t('tabs.clubs')}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeams.map((team) => (
            <button
              key={team.id}
              onClick={() => handleTeamSelect(team)}
              className="bg-background-card hover:bg-background-light border border-background-light rounded-xl p-6 text-start transition-all hover:scale-105 active:scale-100"
            >
              <div className="flex items-center gap-4">
                <div className="text-5xl">{team.flag}</div>
                <div className="flex-1">
                  <div className="font-semibold text-lg mb-1">{team.name}</div>
                  <div className="text-sm text-text-muted">
                    {team.type === 'national' ? team.country : team.league}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <div
                  className="h-3 flex-1 rounded"
                  style={{ backgroundColor: team.colors.primary }}
                />
                <div
                  className="h-3 flex-1 rounded"
                  style={{ backgroundColor: team.colors.secondary }}
                />
              </div>
            </button>
          ))}
        </div>

        {filteredTeams.length === 0 && (
          <div className="text-center py-12 text-text-muted">{tCommon('noResults')}</div>
        )}
      </div>
    </main>
  );
}
