import React, { useState } from 'react';
import type { SquareValue, Player, BoardTheme } from '../types.ts';

interface SquareProps {
  value: SquareValue;
  onClick: () => void;
  isLocked?: boolean;
  isWinning?: boolean;
  isSuggested?: boolean;
  isDraw?: boolean;
  currentPlayer: Player;
  boardTheme: BoardTheme;
}

const Square: React.FC<SquareProps> = ({ value, onClick, isLocked, isWinning, isSuggested, isDraw, currentPlayer, boardTheme }) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!!value || isLocked) return;
    setIsPressed(true);
    onClick();
  };

  const handlePointerUp = () => setIsPressed(false);
  const handlePointerLeave = () => setIsPressed(false);

  const textClass = value === 'X' 
    ? 'text-[--color-player-x]' 
    : 'text-[--color-player-o]';
  
  const getThemeClasses = () => {
    switch(boardTheme) {
      case 'bubble':
        return 'rounded-full border-4 border-white/10 shadow-[inset_0_4px_12px_rgba(0,0,0,0.4),0_8px_16px_rgba(0,0,0,0.2)] backdrop-blur-sm';
      case 'cyber':
        return 'rounded-none border-2 border-[--color-accent] skew-x-1 shadow-[4px_4px_0px_var(--color-accent-hover)]';
      case 'sketch':
        return 'rounded-[25px_15px_30px_10px/10px_35px_15px_25px] border-[3px] border-dashed border-[--color-text-secondary] bg-transparent';
      default:
        return 'rounded-xl shadow-lg';
    }
  };
  
  const winningClass = isWinning
    ? 'animate-win z-10'
    : `bg-[--color-square-bg] hover:bg-[--color-square-hover] ${getThemeClasses()}`;
  
  const suggestedClass = isSuggested && !value ? 'animate-suggest' : '';
  const drawClass = isDraw && value ? 'animate-head-shake' : '';

  return (
    <button
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      className={`relative w-[72px] h-[72px] xs:w-24 xs:h-24 md:w-28 md:h-28 flex items-center justify-center text-4xl xs:text-5xl md:text-6xl font-black transition-all duration-150 select-none touch-none focus:outline-none focus:ring-4 focus:ring-[--color-accent] disabled:cursor-not-allowed ${winningClass} ${suggestedClass} ${isPressed ? 'scale-90 brightness-125' : 'scale-100'} ${value ? 'animate-jelly' : ''}`}
      disabled={!!value || isLocked}
      aria-label={`Square ${isSuggested ? 'suggested move' : ''}`}
    >
      <span className={`${value ? 'animate-pop-in' : 'opacity-0'} ${textClass} ${drawClass} pointer-events-none drop-shadow-lg`}>
        {value}
      </span>
      {isPressed && !value && !isLocked && (
        <div className={`absolute inset-0 animate-ping opacity-30 ${boardTheme === 'bubble' ? 'rounded-full' : 'rounded-xl'} border-4 border-[--color-accent]`} />
      )}
    </button>
  );
};

export default Square;