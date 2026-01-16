'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { getTeamById } from '@/data/teams';
import { getNewsByTeam, getNewsByCategory } from '@/data/news';
import { NewsArticle } from '@/lib/types/news';
import { ArrowLeft, Clock, ExternalLink } from 'lucide-react';

export default function NewsPage() {
  const params = useParams();
  const teamId = params.teamId as string;
  const team = getTeamById(teamId);
  const [categoryFilter, setCategoryFilter] = useState<'all' | NewsArticle['category']>('all');

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

  const allNews = getNewsByTeam(teamId);
  const displayNews =
    categoryFilter === 'all' ? allNews : getNewsByCategory(teamId, categoryFilter);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getCategoryColor = (category: NewsArticle['category']) => {
    switch (category) {
      case 'match':
        return 'bg-status-success text-white';
      case 'transfer':
        return 'bg-status-warning text-white';
      case 'injury':
        return 'bg-status-danger text-white';
      case 'general':
        return 'bg-status-info text-white';
    }
  };

  const getCategoryLabel = (category: NewsArticle['category']) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
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

          <h1 className="text-4xl font-bold">News</h1>
          <p className="text-lg opacity-90 mt-2">Latest updates about {team.name}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              categoryFilter === 'all'
                ? 'bg-team-primary text-white'
                : 'bg-background-card text-text-secondary hover:bg-background-light'
            }`}
          >
            All News
          </button>
          <button
            onClick={() => setCategoryFilter('match')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              categoryFilter === 'match'
                ? 'bg-team-primary text-white'
                : 'bg-background-card text-text-secondary hover:bg-background-light'
            }`}
          >
            Match Reports
          </button>
          <button
            onClick={() => setCategoryFilter('transfer')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              categoryFilter === 'transfer'
                ? 'bg-team-primary text-white'
                : 'bg-background-card text-text-secondary hover:bg-background-light'
            }`}
          >
            Transfers
          </button>
          <button
            onClick={() => setCategoryFilter('injury')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              categoryFilter === 'injury'
                ? 'bg-team-primary text-white'
                : 'bg-background-card text-text-secondary hover:bg-background-light'
            }`}
          >
            Injuries
          </button>
          <button
            onClick={() => setCategoryFilter('general')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              categoryFilter === 'general'
                ? 'bg-team-primary text-white'
                : 'bg-background-card text-text-secondary hover:bg-background-light'
            }`}
          >
            General
          </button>
        </div>

        <div className="space-y-4">
          {displayNews.map((article) => (
            <div
              key={article.id}
              className="bg-background-card rounded-xl p-6 hover:bg-background-light transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <span
                  className={`${getCategoryColor(
                    article.category
                  )} text-xs px-3 py-1 rounded-full font-semibold whitespace-nowrap`}
                >
                  {getCategoryLabel(article.category)}
                </span>
                <div className="flex items-center gap-2 text-sm text-text-muted whitespace-nowrap">
                  <Clock size={14} />
                  {formatDate(article.publishedAt)}
                </div>
              </div>

              <h3 className="font-bold text-xl mb-3 leading-tight">{article.title}</h3>
              <p className="text-text-secondary mb-4 leading-relaxed">{article.excerpt}</p>

              <div className="flex items-center justify-between pt-4 border-t border-background-light gap-4">
                <span className="text-sm text-text-muted">
                  Source: <span className="font-medium">{article.source}</span>
                </span>
                <button className="text-team-primary hover:underline flex items-center gap-1 text-sm font-medium whitespace-nowrap">
                  Read More <ExternalLink size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {displayNews.length === 0 && (
          <div className="text-center py-12 text-text-muted">
            <div className="text-5xl mb-4">📰</div>
            <div className="text-lg">No news articles found in this category.</div>
          </div>
        )}
      </div>
    </main>
  );
}
