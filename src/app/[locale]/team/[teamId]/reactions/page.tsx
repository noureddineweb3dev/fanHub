'use client';

import { useParams } from 'next/navigation';
import { useState, useMemo, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { getTeamById } from '@/data/teams';
import { getRecentMatches } from '@/data/matches';
import { ArrowLeft, Search, Play, Eye, Clock, Video, X, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

interface VideoItem {
  id: string;
  title: string;
  channelName: string;
  views: number;
  uploadedAt: string;
  duration: string;
  thumbnailColor: string;
}

export default function ReactionsPage() {
  const params = useParams();
  const locale = params.locale as string;
  const teamId = params.teamId as string;
  const team = getTeamById(teamId);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const t = useTranslations('reactions');
  const tCommon = useTranslations('common');
  const tTime = useTranslations('time');
  const tMatches = useTranslations('matches');

  const recentMatches = useMemo(() => getRecentMatches(teamId), [teamId]);
  const vsText = tMatches('vs') || 'VS';

  const mockVideos = useMemo<VideoItem[]>(() => {
    return recentMatches.map((match, index) => ({
      id: `video-${index}`,
      title: `${team?.name || 'Team'} ${vsText} ${match.opponent} ${match.score?.home}-${match.score?.away} - Fan Reactions & Highlights`,
      channelName: index % 2 === 0 ? 'Football Highlights HD' : 'Fan Reactions World',
      views: Math.floor(Math.random() * 500000) + 50000,
      uploadedAt: match.date,
      duration: `${Math.floor(Math.random() * 10) + 5}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      thumbnailColor: index % 3 === 0 ? '#ef4444' : index % 3 === 1 ? '#3b82f6' : '#10b981',
    }));
  }, [recentMatches, team?.name, vsText]);

  // Debounce search
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setIsSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredVideos = useMemo(() => {
    if (!debouncedSearchQuery) return mockVideos;
    const query = debouncedSearchQuery.toLowerCase();
    return mockVideos.filter(
      (video) =>
        video.title.toLowerCase().includes(query) ||
        video.channelName.toLowerCase().includes(query)
    );
  }, [debouncedSearchQuery, mockVideos]);

  const formatViews = useCallback((views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(0)}K`;
    }
    return views.toString();
  }, []);

  const formatDate = useCallback((dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays === 0) return tTime('today') || 'Today';
    if (diffDays === 1) return tTime('yesterday') || 'Yesterday';
    if (diffDays < 7) return tTime('daysAgo', { days: diffDays }) || `${diffDays} days ago`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return tTime('weeksAgo', { weeks }) || `${weeks} weeks ago`;
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }, [tTime]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
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
            <Video className="w-8 h-8 sm:w-10 sm:h-10 filter drop-shadow-lg" />
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-1 drop-shadow-lg">
                {t('title') || 'Fan Reactions'}
              </h1>
              <p className="text-base sm:text-lg opacity-90">
                {t('subtitle') || 'Watch fan reactions and match highlights'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Search Bar */}
        <div className="mb-8 relative">
          <div className="relative group">
            <Search className="absolute start-4 top-1/2 -translate-y-1/2 text-text-muted z-10 group-focus-within:text-team-primary transition-colors" size={22} />
            <input
              type="text"
              placeholder={t('searchPlaceholder') || 'Search videos...'}
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

        {/* Results Count */}
        {filteredVideos.length > 0 && (
          <div className="mb-6 text-sm text-text-muted flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-team-primary" />
            <span className="font-medium">
              {filteredVideos.length} {filteredVideos.length === 1 ? 'video' : 'videos'} {debouncedSearchQuery ? 'found' : 'available'}
            </span>
          </div>
        )}

        {/* Videos Grid */}
        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredVideos.map((video, index) => (
              <div
                key={video.id}
                className="group relative bg-background-card/90 backdrop-blur-md hover:bg-background-card border-2 border-background-light hover:border-team-primary/60 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-team-primary/20 animate-fade-in-up cursor-pointer"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${team.colors.primary}22, ${team.colors.secondary}22)`,
                  }}
                />

                {/* Thumbnail */}
                <div
                  className="relative aspect-video overflow-hidden"
                  style={{ backgroundColor: video.thumbnailColor }}
                >
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                    <div className="bg-black/70 group-hover:bg-black/80 transition-all duration-300 rounded-full p-4 group-hover:scale-110 shadow-2xl">
                      <Play className="text-white" size={32} fill="white" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 end-3 bg-black/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-lg">
                    {video.duration}
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10 p-5">
                  <h3 className="font-bold text-base sm:text-lg mb-3 line-clamp-2 leading-tight text-text-primary group-hover:text-team-primary transition-colors">
                    {video.title}
                  </h3>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-team-primary to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-lg shrink-0">
                      {video.channelName.charAt(0)}
                    </div>
                    <div className="text-sm text-text-secondary font-medium truncate">{video.channelName}</div>
                  </div>

                  <div className="flex items-center gap-4 text-xs sm:text-sm text-text-muted">
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-4 h-4" />
                      {formatViews(video.views)} {t('views') || 'views'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {formatDate(video.uploadedAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : recentMatches.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="text-7xl mb-6 animate-bounce">📺</div>
              <h3 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
                {t('noVideos') || 'No videos available'}
              </h3>
              <p className="text-text-muted text-lg leading-relaxed">
                {t('noVideosDescription') || 'There are no recent matches to show reactions for.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="text-7xl mb-6 animate-bounce">🔍</div>
              <h3 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
                {t('noResults') || 'No results found'}
              </h3>
              <p className="text-text-muted text-lg leading-relaxed mb-8">
                {t('noResultsDescription') || `No videos match "${debouncedSearchQuery}". Try searching with different terms.`}
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

        {/* Coming Soon Banner */}
        {filteredVideos.length > 0 && (
          <div className="mt-10 p-8 bg-background-card/90 backdrop-blur-md border-2 border-dashed border-background-light hover:border-team-primary/50 rounded-2xl transition-all duration-300 hover:shadow-xl animate-fade-in-up">
            <div className="text-center">
              <div className="text-5xl mb-4 animate-pulse">🚀</div>
              <h3 className="font-bold text-xl sm:text-2xl mb-2 text-text-primary">{t('comingSoon') || 'More Features Coming Soon'}</h3>
              <p className="text-text-muted text-base leading-relaxed max-w-2xl mx-auto">
                {t('comingSoonDescription') || 'We\'re working on adding live video streaming, real-time reactions, and more interactive features. Stay tuned!'}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
