export function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  if (!result) {
    return '0 0 0';
  }

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);

  return `${r} ${g} ${b}`;
}

export function applyTeamColors(primary: string, secondary: string): void {
  const primaryRgb = hexToRgb(primary);
  const secondaryRgb = hexToRgb(secondary);

  document.documentElement.style.setProperty('--team-primary', primaryRgb);
  document.documentElement.style.setProperty('--team-secondary', secondaryRgb);
}

export function getContrastColor(hexColor: string): 'light' | 'dark' {
  const rgb = hexToRgb(hexColor).split(' ').map(Number);
  const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
  return brightness > 128 ? 'dark' : 'light';
}
