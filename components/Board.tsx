import React from 'react';
import Square from './Square.tsx';
import type { SquareValue, Player, BoardTheme } from '../types.ts';

interface BoardProps {
  squares: SquareValue[];
  onSquareClick: (index: number) => void;
  winner: Player | 'Draw' | null;
  isLocked?: boolean;
  winningLine: number[] | null;
  suggestedMove?: number | null;
  isDraw?: boolean;
  currentPlayer: Player;
  boardTheme: BoardTheme;
}

const Board: React.FC<BoardProps> = ({ squares, onSquareClick, winner, isLocked, winningLine, suggestedMove, isDraw, currentPlayer, boardTheme }) => {
  return (
    <div 
      className={`grid grid-cols-3 p-3 rounded-lg shadow-2xl transition-opacity duration-500 ${winner ? 'opacity-60' : 'opacity-100'} ${isLocked ? 'cursor-wait' : ''}`}
      style={{ 
        gap: 'var(--board-gap)', 
        backgroundColor: 'var(--board-grid-color)' 
      }}
    >
      {squares.map((value, index) => (
        <Square
          key={index}
          value={value}
          onClick={() => onSquareClick(index)}
          isLocked={isLocked}
          isWinning={winningLine?.includes(index)}
          isSuggested={index === suggestedMove}
          isDraw={isDraw}
          currentPlayer={currentPlayer}
          boardTheme={boardTheme}
        />
      ))}
    </div>
  );
};

export default Board;