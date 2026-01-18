'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { teams, getTeamsByType, searchTeams } from '@/data/teams';
import { Team } from '@/lib/types/team';
import { Search, X, ArrowLeft, Loader2, Globe, Trophy, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

const TAB_OPTIONS = ['all', 'national', 'club'] as const;
type TabType = typeof TAB_OPTIONS[number];

export default function SelectTeamPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('teamSelection');
  const tCommon = useTranslations('common');

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<TabType>('all');
  const [loadingTeam, setLoadingTeam] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setIsSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredTeams = useMemo(() => {
    if (debouncedSearchQuery) {
      return searchTeams(debouncedSearchQuery);
    }
    return selectedTab === 'all' ? teams : getTeamsByType(selectedTab);
  }, [debouncedSearchQuery, selectedTab]);

  const handleTeamSelect = useCallback(async (team: Team) => {
    try {
      setLoadingTeam(team.id);
      localStorage.setItem('selectedTeam', team.id);
      await router.push(`/${locale}/team/${team.id}`);
    } catch (error) {
      console.error('Error selecting team:', error);
      setLoadingTeam(null);
    }
  }, [router, locale]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
  }, []);

  const handleTabChange = useCallback((tab: TabType) => {
    setSelectedTab(tab);
    setSearchQuery('');
    setDebouncedSearchQuery('');
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, team: Team) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTeamSelect(team);
    }
  }, [handleTeamSelect]);

  const tabConfig = [
    { id: 'all' as TabType, icon: Globe, label: t('tabs.all') },
    { id: 'national' as TabType, icon: Trophy, label: t('tabs.national') },
    { id: 'club' as TabType, icon: Trophy, label: t('tabs.clubs') },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-background-card/30 p-4 sm:p-6 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-text-secondary hover:text-team-primary transition-all duration-200 group px-4 py-2 rounded-lg hover:bg-background-card/50"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">{tCommon('back') || 'Back'}</span>
          </Link>
          <div className="relative">
            <LanguageSwitcher />
          </div>
        </div>

        <div className="mb-10 text-center sm:text-start">
          <div className="inline-flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-team-primary animate-pulse" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-team-primary via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
              {t('title')}
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        <div className="mb-8 relative">
          <div className="relative group">
            <Search className="absolute start-4 top-1/2 -translate-y-1/2 text-text-muted z-10 group-focus-within:text-team-primary transition-colors" size={22} />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background-card/90 backdrop-blur-md border-2 border-background-light rounded-2xl py-4 ps-14 pe-14 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-team-primary/50 focus:border-team-primary transition-all shadow-lg hover:shadow-xl text-lg"
            />
            <div className="absolute end-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {isSearching && (
                <Loader2 className="w-5 h-5 animate-spin text-team-primary" />
              )}
              {searchQuery && !isSearching && (
                <button
                  onClick={clearSearch}
                  className="text-text-muted hover:text-text-primary transition-colors p-1 hover:bg-background-light rounded-lg"
                  aria-label="Clear search"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-8 justify-center sm:justify-start">
          {tabConfig.map((tab) => {
            const Icon = tab.icon;
            const isActive = selectedTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`group relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-team-primary to-purple-500 text-white shadow-lg shadow-team-primary/30 scale-105'
                    : 'bg-background-card/90 backdrop-blur-sm text-text-secondary hover:bg-background-light border border-background-light hover:border-team-primary/50 hover:scale-102'
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className={`w-4 h-4 transition-transform ${isActive ? 'scale-110' : ''}`} />
                  {tab.label}
                </span>
                {isActive && (
                  <span className="absolute inset-0 bg-gradient-to-r from-team-primary to-purple-500 rounded-xl blur-xl opacity-50 -z-0" />
                )}
              </button>
            );
          })}
        </div>

        {filteredTeams.length > 0 && (
          <div className="mb-6 text-sm text-text-muted flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-team-primary" />
            <span className="font-medium">
              {filteredTeams.length} {filteredTeams.length === 1 ? 'team' : 'teams'} {debouncedSearchQuery ? 'found' : 'available'}
            </span>
          </div>
        )}

        {filteredTeams.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredTeams.map((team, index) => (
              <button
                key={team.id}
                onClick={() => handleTeamSelect(team)}
                onKeyDown={(e) => handleKeyDown(e, team)}
                disabled={loadingTeam === team.id}
                className="group relative bg-background-card/90 backdrop-blur-md hover:bg-background-card border-2 border-background-light hover:border-team-primary/60 rounded-2xl p-6 text-start transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-team-primary/20 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden focus:outline-none focus:ring-2 focus:ring-team-primary/50 animate-fade-in-up"
                style={{
                  animationDelay: `${index * 0.03}s`,
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${team.colors.primary}22, ${team.colors.secondary}22)`,
                  }}
                />

                <div className="relative z-10">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="text-5xl sm:text-6xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 filter drop-shadow-2xl flex-shrink-0">
                      {team.flag}
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="font-bold text-lg sm:text-xl mb-1.5 text-text-primary truncate group-hover:text-team-primary transition-colors">
                        {team.name}
                      </div>
                      <div className="text-sm text-text-muted flex items-center gap-1.5">
                        <span className="truncate">
                          {team.type === 'national' ? team.country : team.league}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-5">
                    <div
                      className="h-3 flex-1 rounded-full shadow-md transform group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: team.colors.primary }}
                    />
                    <div
                      className="h-3 flex-1 rounded-full shadow-md transform group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: team.colors.secondary }}
                    />
                  </div>

                  {loadingTeam === team.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background-card/95 backdrop-blur-sm rounded-2xl z-20">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-10 h-10 animate-spin text-team-primary" />
                        <span className="text-sm text-text-muted font-medium">Loading...</span>
                      </div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="text-7xl mb-6 animate-bounce">🔍</div>
              <h3 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
                {tCommon('noResults') || 'No teams found'}
              </h3>
              <p className="text-text-muted mb-8 text-lg leading-relaxed">
                {debouncedSearchQuery
                  ? `No teams match "${debouncedSearchQuery}". Try searching with a different term.`
                  : 'Try adjusting your filters or search for your favorite team.'}
              </p>
              {debouncedSearchQuery && (
                <button
                  onClick={clearSearch}
                  className="px-8 py-3.5 bg-gradient-to-r from-team-primary to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-team-primary/30 transition-all duration-200 hover:scale-105 active:scale-100"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
