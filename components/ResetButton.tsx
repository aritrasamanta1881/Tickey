import React, { useState } from 'react';
import { t } from '../utils/translations.ts';
import type { Player, Language } from '../types.ts';

interface ResetButtonProps {
  onReset: () => void;
  onQuit: () => void;
  winner: Player | 'Draw' | null;
  language: Language;
  visible?: boolean;
}

const ResetButton: React.FC<ResetButtonProps> = ({ onReset, onQuit, winner, language, visible }) => {
  const [showQuitConfirmation, setShowQuitConfirmation] = useState(false);

  // If no winner, or if we are waiting for the overlay delay
  if (!winner || !visible) {
    return <div className="mt-8 h-12" />;
  }

  if (showQuitConfirmation) {
    return (
      <div className="mt-8 text-center animate-fade-in w-full max-w-xs">
        <h3 className="text-lg font-semibold text-[--color-text-primary] mb-4">
          {t('quitConfirmation', language)}
        </h3>
        <div className="flex justify-center gap-4">
          <button
            onClick={onQuit}
            className="w-28 py-2 px-4 rounded-lg bg-red-600 text-white font-semibold transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[--color-background] focus:ring-red-500"
            aria-label="Confirm quit game"
          >
            {t('yes', language)}
          </button>
          <button
            onClick={() => setShowQuitConfirmation(false)}
            className="w-28 py-2 px-4 rounded-lg bg-slate-600 text-white font-semibold transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[--color-background] focus:ring-slate-500"
            aria-label="Cancel quit game"
          >
            {t('no', language)}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 h-12">
      <div className="flex gap-4 animate-fade-in">
        <button
          onClick={() => setShowQuitConfirmation(true)}
          className="px-6 py-2 bg-amber-600 text-white font-semibold rounded-lg shadow-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[--color-background] focus:ring-amber-500 transition-all duration-200 transform hover:scale-105"
        >
          {t('quitGame', language)}
        </button>
        <button
          onClick={onReset}
          className="px-6 py-2 bg-[--color-accent] text-white font-semibold rounded-lg shadow-md hover:bg-[--color-accent-hover] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[--color-background] focus:ring-[--color-accent] transition-all duration-200 transform hover:scale-105"
        >
          {t('playAgain', language)}
        </button>
      </div>
    </div>
  );
};

export default ResetButton;