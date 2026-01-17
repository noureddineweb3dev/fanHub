'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getTeamById } from '@/data/teams';
import { applyTeamColors } from '@/lib/utils/colors';

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const router = useRouter();
  const teamId = params.teamId as string;

  useEffect(() => {
    const team = getTeamById(teamId);

    if (!team) {
      router.push('/select-team');
      return;
    }

    applyTeamColors(team.colors.primary, team.colors.secondary);
    localStorage.setItem('selectedTeam', team.id);
  }, [teamId, router]);

  return <>{children}</>;
}
