import React from 'react';
import { t } from '../utils/translations.ts';
import type { Player, Language } from '../types.ts';

interface GameResultOverlayProps {
  winner: Player | 'Draw' | null;
  language: Language;
}

const GameResultOverlay: React.FC<GameResultOverlayProps> = ({ winner, language }) => {
  if (!winner) return null;

  const getFunnyMessage = () => {
    if (winner === 'Draw') {
      const messages = [
        "A tie? Come on, try harder! 🤡",
        "Nobody wins... awkwaaard. 😬",
        "It's a stalemate. Boooo! 🍅",
        "Balanced as all things should be? 🤷‍♂️"
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    }
    if (winner === 'X') {
      const messages = [
        "X crushed the competition! 👑",
        "Player X is the new legend! 🔥",
        "Dominated! X took the crown. 🏆",
        "X is just built different. 💪"
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    }
    if (winner === 'O') {
      const messages = [
        "AI overlord O wins! 🤖",
        "O just outplayed everyone! 💡",
        "Round 1 goes to O! ⭕",
        "The power of the circle! 🍩"
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    }
    return "";
  };

  const getResultText = () => {
    if (winner === 'Draw') return t('statusDraw', language);
    return `${t('statusWinner', language)} ${winner}`;
  };

  const colorClass = winner === 'Draw' 
    ? 'text-[--color-player-o]' 
    : winner === 'X' 
      ? 'text-[--color-player-x]' 
      : 'text-[--color-player-o]';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="text-center p-8 rounded-3xl bg-[--color-board-bg] border-4 border-white/10 shadow-2xl animate-result-pop">
        <div className="text-6xl mb-6 drop-shadow-xl animate-bounce">
          {winner === 'X' ? '🎉' : winner === 'O' ? '🎊' : '🤝'}
        </div>
        <h2 className={`text-5xl xs:text-6xl font-black mb-4 uppercase tracking-tighter ${colorClass} drop-shadow-lg`}>
          {getResultText()}
        </h2>
        <p className="text-xl xs:text-2xl text-[--color-text-secondary] font-medium animate-pulse">
          {getFunnyMessage()}
        </p>
      </div>
    </div>
  );
};

export default GameResultOverlay;