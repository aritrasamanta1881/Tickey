
export type Player = 'X' | 'O';
export type SquareValue = Player | null;
export type GameMode = 'pvp' | 'pva';
export type AIDifficulty = 'easy' | 'medium' | 'hard';
export type ThemeName = 'classic' | 'forest' | 'neon';
export type BoardTheme = 'modern' | 'bubble' | 'cyber' | 'sketch';
export type Language = 'en' | 'hi-en' | 'hi' | 'bn' | 'ta' | 'te' | 'ml' | 'gu' | 'mr' | 'or' | 'bho';

export interface GameStats {
  totalGames: number;
  xWins: number;
  oWins: number;
  draws: number;
  xStreak: number;
  oStreak: number;
}
