export interface Player {
  id: string;
  teamId: string;
  name: string;
  number: number;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  club: string;
  nationality: string;
  age: number;
  stats: {
    appearances: number;
    goals: number;
    assists: number;
  };
}
