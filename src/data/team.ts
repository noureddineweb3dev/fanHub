import { Team } from '@/lib/types/team';
import { hexToRgb } from '@/lib/utils/colors';

const rawTeams: Omit<Team, 'primaryRGB' | 'secondaryRGB'>[] = [
  {
    id: 'morocco',
    name: 'Morocco',
    shortName: 'MAR',
    type: 'national',
    country: 'Morocco',
    flag: '🇲🇦',
    colors: {
      primary: '#C1272D',
      secondary: '#006233',
    },
  },
  {
    id: 'brazil',
    name: 'Brazil',
    shortName: 'BRA',
    type: 'national',
    country: 'Brazil',
    flag: '🇧🇷',
    colors: {
      primary: '#009B3A',
      secondary: '#FEDF00',
    },
  },
  {
    id: 'argentina',
    name: 'Argentina',
    shortName: 'ARG',
    type: 'national',
    country: 'Argentina',
    flag: '🇦🇷',
    colors: {
      primary: '#74ACDF',
      secondary: '#FFFFFF',
    },
  },
  {
    id: 'spain',
    name: 'Spain',
    shortName: 'ESP',
    type: 'national',
    country: 'Spain',
    flag: '🇪🇸',
    colors: {
      primary: '#CE1126',
      secondary: '#FCD116',
    },
  },
  {
    id: 'germany',
    name: 'Germany',
    shortName: 'GER',
    type: 'national',
    country: 'Germany',
    flag: '🇩🇪',
    colors: {
      primary: '#000000',
      secondary: '#DD0000',
    },
  },
  {
    id: 'france',
    name: 'France',
    shortName: 'FRA',
    type: 'national',
    country: 'France',
    flag: '🇫🇷',
    colors: {
      primary: '#0055A4',
      secondary: '#EF4135',
    },
  },
  {
    id: 'portugal',
    name: 'Portugal',
    shortName: 'POR',
    type: 'national',
    country: 'Portugal',
    flag: '🇵🇹',
    colors: {
      primary: '#006600',
      secondary: '#FF0000',
    },
  },
  {
    id: 'england',
    name: 'England',
    shortName: 'ENG',
    type: 'national',
    country: 'England',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    colors: {
      primary: '#FFFFFF',
      secondary: '#CE1124',
    },
  },
  {
    id: 'manchester-united',
    name: 'Manchester United',
    shortName: 'MUN',
    type: 'club',
    country: 'England',
    league: 'Premier League',
    flag: '🔴',
    colors: {
      primary: '#DA291C',
      secondary: '#000000',
    },
  },
  {
    id: 'barcelona',
    name: 'FC Barcelona',
    shortName: 'FCB',
    type: 'club',
    country: 'Spain',
    league: 'La Liga',
    flag: '🔵🔴',
    colors: {
      primary: '#A50044',
      secondary: '#004D98',
    },
  },
  {
    id: 'real-madrid',
    name: 'Real Madrid',
    shortName: 'RMA',
    type: 'club',
    country: 'Spain',
    league: 'La Liga',
    flag: '⚪',
    colors: {
      primary: '#FFFFFF',
      secondary: '#00529F',
    },
  },
  {
    id: 'manchester-city',
    name: 'Manchester City',
    shortName: 'MCI',
    type: 'club',
    country: 'England',
    league: 'Premier League',
    flag: '💙',
    colors: {
      primary: '#6CABDD',
      secondary: '#FFFFFF',
    },
  },
  {
    id: 'psg',
    name: 'Paris Saint-Germain',
    shortName: 'PSG',
    type: 'club',
    country: 'France',
    league: 'Ligue 1',
    flag: '🔴🔵',
    colors: {
      primary: '#034694',
      secondary: '#EE242C',
    },
  },
  {
    id: 'bayern',
    name: 'Bayern Munich',
    shortName: 'FCB',
    type: 'club',
    country: 'Germany',
    league: 'Bundesliga',
    flag: '🔴⚪',
    colors: {
      primary: '#DC052D',
      secondary: '#0066B2',
    },
  },
];

export const teams: Team[] = rawTeams.map((team) => ({
  ...team,
  primaryRGB: hexToRgb(team.colors.primary),
  secondaryRGB: hexToRgb(team.colors.secondary),
}));

export function getTeamById(id: string): Team | undefined {
  return teams.find((team) => team.id === id);
}

export function getTeamsByType(type: 'national' | 'club'): Team[] {
  return teams.filter((team) => team.type === type);
}

export function searchTeams(query: string): Team[] {
  const lowerQuery = query.toLowerCase();
  return teams.filter(
    (team) =>
      team.name.toLowerCase().includes(lowerQuery) ||
      team.shortName.toLowerCase().includes(lowerQuery) ||
      team.country?.toLowerCase().includes(lowerQuery)
  );
}
