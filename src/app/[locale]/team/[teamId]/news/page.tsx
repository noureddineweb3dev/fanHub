'use client';

import { useParams } from 'next/navigation';
import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { getTeamById } from '@/data/teams';
import { getNewsByTeam, getNewsByCategory } from '@/data/news';
import { NewsArticle } from '@/lib/types/news';
import { ArrowLeft, Clock, ExternalLink, Newspaper, Trophy, TrendingUp, AlertCircle, Info } from 'lucide-react';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

type CategoryFilter = 'all' | NewsArticle['category'];

export default function NewsPage() {
  const params = useParams();
  const locale = params.locale as string;
  const teamId = params.teamId as string;
  const team = getTeamById(teamId);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const t = useTranslations('news');
  const tCommon = useTranslations('common');
  const tTime = useTranslations('time');

  const allNews = useMemo(() => getNewsByTeam(teamId), [teamId]);
  const displayNews = useMemo(() => {
    return categoryFilter === 'all' ? allNews : getNewsByCategory(teamId, categoryFilter);
  }, [teamId, categoryFilter, allNews]);

  const formatDate = useCallback((dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return tTime('justNow') || 'Just now';
    if (diffHours < 24) return tTime('hoursAgo', { hours: diffHours }) || `${diffHours} hours ago`;
    if (diffDays < 7) return tTime('daysAgo', { days: diffDays }) || `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }, [tTime]);

  const getCategoryColor = useCallback((category: NewsArticle['category']) => {
    switch (category) {
      case 'match':
        return 'bg-status-success/20 text-status-success border-status-success/30';
      case 'transfer':
        return 'bg-status-warning/20 text-status-warning border-status-warning/30';
      case 'injury':
        return 'bg-status-danger/20 text-status-danger border-status-danger/30';
      case 'general':
        return 'bg-status-info/20 text-status-info border-status-info/30';
    }
  }, []);

  const getCategoryIcon = useCallback((category: NewsArticle['category']) => {
    switch (category) {
      case 'match':
        return Trophy;
      case 'transfer':
        return TrendingUp;
      case 'injury':
        return AlertCircle;
      case 'general':
        return Info;
    }
  }, []);

  const getCategoryLabel = useCallback((category: NewsArticle['category']) => {
    return t(`categories.${category}`) || category.charAt(0).toUpperCase() + category.slice(1);
  }, [t]);

  const handleFilterChange = useCallback((filter: CategoryFilter) => {
    setCategoryFilter(filter);
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

  const categoryFilters = [
    { id: 'all' as CategoryFilter, label: t('filters.all') || 'All', icon: Newspaper },
    { id: 'match' as CategoryFilter, label: t('filters.match') || 'Match', icon: Trophy },
    { id: 'transfer' as CategoryFilter, label: t('filters.transfer') || 'Transfer', icon: TrendingUp },
    { id: 'injury' as CategoryFilter, label: t('filters.injury') || 'Injury', icon: AlertCircle },
    { id: 'general' as CategoryFilter, label: t('filters.general') || 'General', icon: Info },
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
            <Newspaper className="w-8 h-8 sm:w-10 sm:h-10 filter drop-shadow-lg" />
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-1 drop-shadow-lg">
                {t('title') || 'News'}
              </h1>
              <p className="text-base sm:text-lg opacity-90">
                {t('subtitle') || 'Latest updates from'} {team.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center sm:justify-start">
          {categoryFilters.map((filter) => {
            const Icon = filter.icon;
            const isActive = categoryFilter === filter.id;
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

        {/* News Articles */}
        {displayNews.length > 0 ? (
          <div className="space-y-4 sm:space-y-6">
            {displayNews.map((article, index) => {
              const CategoryIcon = getCategoryIcon(article.category);
              return (
                <article
                  key={article.id}
                  className="group relative bg-background-card/90 backdrop-blur-md hover:bg-background-card border-2 border-background-light hover:border-team-primary/60 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-team-primary/20 animate-fade-in-up overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${team.colors.primary}22, ${team.colors.secondary}22)`,
                    }}
                  />

                  {/* Header */}
                  <div className="relative z-10 flex items-start justify-between gap-4 mb-4 flex-wrap">
                    <span
                      className={`${getCategoryColor(article.category)} border-2 text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap flex items-center gap-1.5`}
                    >
                      <CategoryIcon className="w-3 h-3" />
                      {getCategoryLabel(article.category)}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-text-muted whitespace-nowrap">
                      <Clock className="w-4 h-4" />
                      <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="font-bold text-xl sm:text-2xl mb-3 leading-tight text-text-primary group-hover:text-team-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-text-secondary mb-4 leading-relaxed text-base">
                      {article.excerpt}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="relative z-10 flex items-center justify-between pt-4 border-t border-background-light gap-4 flex-wrap">
                    <span className="text-sm text-text-muted">
                      {t('source') || 'Source'}: <span className="font-medium text-text-secondary">{article.source}</span>
                    </span>
                    <button className="text-team-primary hover:text-team-primary/80 hover:underline flex items-center gap-1.5 text-sm font-semibold whitespace-nowrap transition-all duration-200 hover:scale-105 group/button">
                      {t('readMore') || 'Read More'}
                      <ExternalLink className="w-4 h-4 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5 transition-transform" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="text-7xl mb-6 animate-bounce">📰</div>
              <h3 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
                {t('noArticles') || 'No articles found'}
              </h3>
              <p className="text-text-muted text-lg leading-relaxed">
                {categoryFilter === 'all'
                  ? 'No news articles available for this team at the moment.'
                  : `No ${getCategoryLabel(categoryFilter)} articles available for this team.`}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
