'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { getTeamById } from '@/data/teams';
import { getRecentMatches } from '@/data/matches';
import { ArrowLeft, Search, Play, Eye, Clock } from 'lucide-react';

export default function ReactionsPage() {
  const params = useParams();
  const teamId = params.teamId as string;
  const team = getTeamById(teamId);
  const [searchQuery, setSearchQuery] = useState('');

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

  const recentMatches = getRecentMatches(teamId);

  const mockVideos = recentMatches.map((match, index) => ({
    id: `video-${index}`,
    title: `${team.name} vs ${match.opponent} ${match.score?.home}-${match.score?.away} - Fan Reactions & Highlights`,
    channelName: index % 2 === 0 ? 'Football Highlights HD' : 'Fan Reactions World',
    views: Math.floor(Math.random() * 500000) + 50000,
    uploadedAt: match.date,
    duration: `${Math.floor(Math.random() * 10) + 5}:${Math.floor(Math.random() * 60)
      .toString()
      .padStart(2, '0')}`,
    thumbnailColor: index % 3 === 0 ? '#ef4444' : index % 3 === 1 ? '#3b82f6' : '#10b981',
  }));

  const filteredVideos = searchQuery
    ? mockVideos.filter(
        (video) =>
          video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.channelName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockVideos;

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(0)}K`;
    }
    return views.toString();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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

          <h1 className="text-4xl font-bold">Fan Reactions</h1>
          <p className="text-lg opacity-90 mt-2">Watch fan reactions and highlights</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6">
          <div className="relative">
            <Search
              className="absolute start-4 top-1/2 -translate-y-1/2 text-text-muted"
              size={20}
            />
            <input
              type="text"
              placeholder="Search reactions by match, team, or channel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background-card border border-background-light rounded-xl py-4 ps-12 pe-4 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-team-primary transition-colors"
            />
          </div>
        </div>

        {filteredVideos.length === 0 && recentMatches.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📺</div>
            <h3 className="text-xl font-bold mb-2">No Videos Available Yet</h3>
            <p className="text-text-muted">Videos will appear here after matches are played</p>
          </div>
        )}

        {filteredVideos.length === 0 && recentMatches.length > 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2">No Results Found</h3>
            <p className="text-text-muted">Try a different search term</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="bg-background-card rounded-xl overflow-hidden hover:bg-background-light transition-colors cursor-pointer group"
            >
              <div
                className="relative aspect-video"
                style={{ backgroundColor: video.thumbnailColor }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/70 group-hover:bg-black/80 transition-colors rounded-full p-4">
                    <Play className="text-white" size={32} fill="white" />
                  </div>
                </div>
                <div className="absolute bottom-2 end-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-base mb-2 line-clamp-2 leading-tight">
                  {video.title}
                </h3>

                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-team-primary flex items-center justify-center text-white text-xs font-bold">
                    {video.channelName.charAt(0)}
                  </div>
                  <div className="text-sm text-text-muted">{video.channelName}</div>
                </div>

                <div className="flex items-center gap-3 text-xs text-text-muted">
                  <span className="flex items-center gap-1">
                    <Eye size={14} />
                    {formatViews(video.views)} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {formatDate(video.uploadedAt)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVideos.length > 0 && (
          <div className="mt-8 p-6 bg-background-card rounded-xl border-2 border-dashed border-background-light">
            <div className="text-center">
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="font-bold text-lg mb-2">Coming Soon: YouTube Integration</h3>
              <p className="text-text-muted text-sm">
                These are placeholder videos. In the next steps, we'll integrate the YouTube API to
                fetch real fan reaction videos automatically!
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
