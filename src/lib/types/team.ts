export interface Team {
  id: string;
  name: string;
  shortName: string;
  type: 'national' | 'club';
  country?: string;
  league?: string;
  flag: string;
  colors: {
    primary: string;
    secondary: string;
  };
  primaryRGB?: string;
  secondaryRGB?: string;
}

export interface TeamColors {
  primary: string;
  secondary: string;
  primaryRGB: string;
  secondaryRGB: string;
}
