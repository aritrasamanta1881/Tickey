import React, { useState, useEffect, useRef } from 'react';
import { t } from '../utils/translations.ts';
import type { Player, GameMode, GameStats, Language } from '../types.ts';

interface GameInfoProps {
  winner: Player | 'Draw' | null;
  currentPlayer: Player;
  gameMode: GameMode | null;
  isAiTurn: boolean;
  stats: GameStats;
  language: Language;
}

const GameInfo: React.FC<GameInfoProps> = ({ winner, currentPlayer, gameMode, isAiTurn, stats, language }) => {
  const [updatedStreaks, setUpdatedStreaks] = useState<Set<'xStreak' | 'oStreak'>>(new Set());
  const prevStatsRef = useRef<GameStats>(undefined);

  useEffect(() => {
    if (prevStatsRef.current) {
        const updated = new Set<'xStreak' | 'oStreak'>();
        if (stats.xStreak !== prevStatsRef.current.xStreak) updated.add('xStreak');
        if (stats.oStreak !== prevStatsRef.current.oStreak) updated.add('oStreak');

        if (updated.size > 0) {
            setUpdatedStreaks(updated);
            const timer = setTimeout(() => setUpdatedStreaks(new Set()), 800);
            return () => clearTimeout(timer);
        }
    }
    prevStatsRef.current = stats;
  }, [stats]);

  const getMoodEmoji = () => {
    if (winner === 'Draw') return '🤝';
    if (winner === 'X') return '👑';
    if (winner === 'O') return '🤖';
    if (isAiTurn) return '🤔';
    if (stats.xStreak > 2) return '🔥';
    if (stats.oStreak > 2) return '😱';
    return currentPlayer === 'X' ? '👤' : '💡';
  };

  const getStatusMessage = () => {
    if (winner) {
      if (winner === 'Draw') {
        return <span className="text-[--color-player-o]">{t('statusDraw', language)}</span>;
      }
      const winnerClass = winner === 'X' ? 'text-[--color-player-x]' : 'text-[--color-player-o]';
      return <>{t('statusWinner', language)} <span className={`${winnerClass} font-bold animate-wiggle`}>{winner}</span></>;
    }

    if (gameMode === 'pva' && isAiTurn) {
      return <span className="text-[--color-text-secondary] animate-pulse">{t('statusAiTurn', language)}</span>;
    }

    const playerClass = currentPlayer === 'X' ? 'text-[--color-player-x]' : 'text-[--color-player-o]';
    return <>{t('statusNextPlayer', language)} <span className={`${playerClass} font-bold`}>{currentPlayer}</span></>;
  };

  return (
    <div className="mb-4 xs:mb-6 flex flex-col items-center justify-start text-center" style={{ height: '6rem' }}>
      <div className="text-4xl mb-1 animate-pop-in drop-shadow-md">
        {getMoodEmoji()}
      </div>
      <div className="flex h-8 xs:h-10 items-center text-xl xs:text-2xl font-black text-[--color-text-primary] tracking-tight">
        <p key={winner || currentPlayer + isAiTurn} className="animate-slide-in-fade">
          {getStatusMessage()}
        </p>
      </div>
      
      {!winner && (
        <div key="streaks" className="mt-1 xs:mt-2 text-sm xs:text-base text-[--color-text-secondary] animate-fade-in flex justify-center items-center gap-4 xs:gap-6" style={{ animationDelay: '0.2s' }}>
          <p className="text-[--color-player-x] font-bold">
              X: <span className={`text-base xs:text-lg text-[--color-text-primary] ${updatedStreaks.has('xStreak') ? 'animate-streak-update' : ''}`}>{stats.xStreak}</span>
          </p>
          <div className="w-px h-3 xs:h-4 bg-slate-600"></div>
          <p className="text-[--color-player-o] font-bold">
              O: <span className={`text-base xs:text-lg text-[--color-text-primary] ${updatedStreaks.has('oStreak') ? 'animate-streak-update' : ''}`}>{stats.oStreak}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default GameInfo;