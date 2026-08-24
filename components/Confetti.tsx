import React from 'react';
import type { Player } from '../types.ts';

interface ConfettiProps {
  winner: Player;
}

const CONFETTI_COUNT = 30;

const Confetti: React.FC<ConfettiProps> = ({ winner }) => {
  const colors = winner === 'X' 
    ? ['var(--color-player-x)', '#0e7490' /* cyan-700 */, '#155e75' /* cyan-800 */] 
    : ['var(--color-player-o)', '#d97706' /* amber-600 */, '#b45309' /* amber-700 */];

  const confetti = Array.from({ length: CONFETTI_COUNT }).map((_, i) => {
    const style = {
      left: `${Math.random() * 100}vw`,
      backgroundColor: colors[Math.floor(Math.random() * colors.length)],
      animationDuration: `${Math.random() * 3 + 2}s`, // 2s to 5s
      animationDelay: `${Math.random() * 2}s`,
      transform: `rotate(${Math.random() * 360}deg)`,
      width: `${Math.floor(Math.random() * 8 + 8)}px`, // 8px to 16px
      height: `${Math.floor(Math.random() * 5 + 5)}px`, // 5px to 10px
      borderRadius: '4px',
    };
    return <div key={i} className="confetti" style={style}></div>;
  });

  return <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">{confetti}</div>;
};

export default Confetti;
