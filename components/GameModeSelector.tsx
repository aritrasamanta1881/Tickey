import React, { useState } from 'react';
import { t } from '../utils/translations.ts';
import type { GameMode, AIDifficulty, Language } from '../types.ts';

interface GameModeSelectorProps {
  onSelectMode: (mode: GameMode, difficulty?: AIDifficulty) => void;
  isSoundEnabled: boolean;
  onSoundToggle: () => void;
  language: Language;
}

const GameModeSelector: React.FC<GameModeSelectorProps> = ({ onSelectMode, isSoundEnabled, onSoundToggle, language }) => {
  const [selectionStep, setSelectionStep] = useState<'mode' | 'difficulty'>('mode');

  if (selectionStep === 'difficulty') {
    return (
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <h2 className="text-2xl text-[--color-text-primary] font-semibold mb-4">{t('chooseDifficulty', language)}</h2>
        <button
          onClick={() => onSelectMode('pva', 'easy')}
          className="w-64 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[--color-background] focus:ring-green-500 transition-all duration-200 transform hover:scale-105"
        >
          {t('easy', language)}
        </button>
        <button
          onClick={() => onSelectMode('pva', 'medium')}
          className="w-64 px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[--color-background] focus:ring-yellow-400 transition-all duration-200 transform hover:scale-105"
        >
          {t('medium', language)}
        </button>
        <button
          onClick={() => onSelectMode('pva', 'hard')}
          className="w-64 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[--color-background] focus:ring-red-500 transition-all duration-200 transform hover:scale-105"
        >
          {t('hard', language)}
        </button>
        <button
          onClick={() => setSelectionStep('mode')}
          className="mt-4 text-[--color-text-secondary] hover:text-[--color-text-primary] transition-colors"
          aria-label="Go back to opponent selection"
        >
          &larr; {t('back', language)}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 animate-fade-in">
      <h2 className="text-2xl text-[--color-text-primary] font-semibold mb-4">{t('chooseOpponent', language)}</h2>
      <button
        onClick={() => onSelectMode('pvp')}
        className="w-64 px-6 py-3 bg-[--color-player-x] text-white font-semibold rounded-lg shadow-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[--color-background] focus:ring-[--color-player-x] transition-all duration-200 transform hover:scale-105"
      >
        {t('playVsHuman', language)}
      </button>
      <button
        onClick={() => setSelectionStep('difficulty')}
        className="w-64 px-6 py-3 bg-[--color-accent] text-white font-semibold rounded-lg shadow-md hover:bg-[--color-accent-hover] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[--color-background] focus:ring-[--color-accent] transition-all duration-200 transform hover:scale-105"
      >
        {t('playVsAI', language)}
      </button>
      <div className="mt-8 flex items-center justify-center gap-4">
        <label htmlFor="sound-toggle-main" className="text-lg font-medium text-[--color-text-primary]">{t('sound', language)}</label>
        <button
            id="sound-toggle-main"
            onClick={onSoundToggle}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[--color-background] focus:ring-[--color-accent] ${isSoundEnabled ? 'bg-[--color-accent]' : 'bg-slate-600'}`}
            role="switch"
            aria-checked={isSoundEnabled}
        >
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isSoundEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
    </div>
  );
};

export default GameModeSelector;