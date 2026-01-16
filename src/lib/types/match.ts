export interface Match {
  id: string;
  teamId: string;
  opponent: string;
  opponentFlag: string;
  isHome: boolean;
  date: string;
  time: string;
  competition: string;
  venue: string;
  status: 'upcoming' | 'live' | 'finished';
  score?: {
    home: number;
    away: number;
  };
}
