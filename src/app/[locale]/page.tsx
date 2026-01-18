'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { ArrowRight, ArrowLeft, Users, Globe, Zap } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('landing');
  const [isLoaded, setIsLoaded] = useState(false);
  const [particles, setParticles] = useState<Array<{ left: number; top: number; delay: number; duration: number }>>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const savedTeam = localStorage.getItem('selectedTeam');
    if (savedTeam) {
      router.push(`/${locale}/team/${savedTeam}`);
    }
  }, [router, locale]);

  // Set content visible after a short delay even if video doesn't load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Ensure video plays
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error('Error playing video:', error);
      });
    }
  }, []);

  // Generate particle positions only on client side to avoid hydration mismatch
  useEffect(() => {
    const generatedParticles = Array.from({ length: 20 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 5 + Math.random() * 5,
    }));
    setParticles(generatedParticles);
  }, []);

  // Video background - using a placeholder URL that can be replaced with actual video
  // You can use a video from Pexels, Unsplash, or your own video
  const videoUrl = '/landing-video.mp4';

  return (
    <main className="relative h-screen w-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        {/* Fallback gradient for browsers that don't support video - behind video */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 z-0" />
        
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-10"
          onLoadedData={() => {
            setIsLoaded(true);
            if (videoRef.current) {
              videoRef.current.play().catch(() => {});
            }
          }}
          onError={(e) => {
            console.error('Video load error:', e);
            setIsLoaded(true);
          }}
          preload="auto"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80 z-20" />
        
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-indigo-600/20 animate-pulse z-30" />
      </div>

      {/* Content */}
      <div className={`relative z-10 w-full max-w-6xl mx-auto px-6 py-4 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Language Switcher */}
        <div className="absolute top-4 end-4 z-20">
          <LanguageSwitcher />
        </div>

        {/* Main Content - Compact to fit screen */}
        <div className="text-center space-y-4">
          {/* Animated Football Icon */}
          <div className="mb-2 animate-bounce">
            <div className="text-6xl md:text-7xl lg:text-8xl filter drop-shadow-2xl">⚽</div>
          </div>

          {/* Title with gradient text */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
              {t('title')}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-text-secondary mb-2 max-w-3xl mx-auto leading-tight">
            {t('subtitle')}
          </p>

          {/* Description */}
          <p className="text-sm md:text-base text-text-muted mb-4 max-w-2xl mx-auto">
            {t('description')}
          </p>

          {/* CTA Button */}
          <Link 
            href={`/${locale}/select-team`}
            className="group inline-flex items-center gap-2 gradient-team px-8 py-3 rounded-xl font-bold text-white text-base md:text-lg hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/50 mb-4"
          >
            <span>{t('chooseTeam')}</span>
            {locale === 'ar' ? (
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            ) : (
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            )}
          </Link>

          {/* Stats Section - Compact */}
          <div className="mt-4 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="group bg-background-card/80 backdrop-blur-md rounded-xl p-3 border border-white/10 hover:border-team-primary/50 transition-all duration-300 hover:scale-105">
              <div className="flex flex-col items-center gap-1">
                <Users className="w-5 h-5 text-team-primary" />
                <div className="text-2xl md:text-3xl font-bold text-text-primary">150+</div>
                <div className="text-xs text-text-muted font-medium">{t('stats.teams')}</div>
              </div>
            </div>

            <div className="group bg-background-card/80 backdrop-blur-md rounded-xl p-3 border border-white/10 hover:border-team-primary/50 transition-all duration-300 hover:scale-105">
              <div className="flex flex-col items-center gap-1">
                <Globe className="w-5 h-5 text-team-primary" />
                <div className="text-2xl md:text-3xl font-bold text-text-primary">4</div>
                <div className="text-xs text-text-muted font-medium">{t('stats.languages')}</div>
              </div>
            </div>

            <div className="group bg-background-card/80 backdrop-blur-md rounded-xl p-3 border border-white/10 hover:border-team-primary/50 transition-all duration-300 hover:scale-105">
              <div className="flex flex-col items-center gap-1">
                <Zap className="w-5 h-5 text-team-primary" />
                <div className="text-2xl md:text-3xl font-bold text-text-primary">24/7</div>
                <div className="text-xs text-text-muted font-medium">{t('stats.updates')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating particles effect - only render on client to avoid hydration mismatch */}
        {particles.length > 0 && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((particle, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
                style={{
                  left: `${particle.left}%`,
                  top: `${particle.top}%`,
                  animationDelay: `${particle.delay}s`,
                  animationDuration: `${particle.duration}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}