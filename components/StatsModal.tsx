import React, { useState, useEffect, useRef } from 'react';
import { t } from '../utils/translations.ts';
import type { GameStats, Language } from '../types.ts';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  onResetStats: () => void;
  language: Language;
}

const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, stats, onResetStats, language }) => {
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const [updatedFields, setUpdatedFields] = useState<Set<keyof GameStats>>(new Set());
  const prevStatsRef = useRef<GameStats>();

  useEffect(() => {
    if (prevStatsRef.current) {
        const updated = new Set<keyof GameStats>();
        (Object.keys(stats) as Array<keyof GameStats>).forEach(key => {
            if (stats[key] !== prevStatsRef.current![key]) {
                updated.add(key);
            }
        });

        if (updated.size > 0) {
            setUpdatedFields(updated);
            const timer = setTimeout(() => {
                setUpdatedFields(new Set());
            }, 800); // Animation duration
            return () => clearTimeout(timer);
        }
    }
    prevStatsRef.current = stats;
  }, [stats]);


  useEffect(() => {
    if (isOpen) {
      setShowResetConfirmation(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleReset = () => {
    onResetStats();
    setShowResetConfirmation(false);
  };

  const xWinPercentage = stats.totalGames > 0 ? ((stats.xWins / stats.totalGames) * 100) : 0;
  const oWinPercentage = stats.totalGames > 0 ? ((stats.oWins / stats.totalGames) * 100) : 0;
  const drawPercentage = stats.totalGames > 0 ? ((stats.draws / stats.totalGames) * 100) : 0;
  
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in"
      style={{ animationDuration: '0.2s' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="stats-title"
    >
      <div
        className="bg-[--color-board-bg] p-8 rounded-lg shadow-2xl w-full max-w-sm text-white relative animate-pop-in"
        style={{ animationDuration: '0.3s' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="stats-title" className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-gradient-from)] to-[var(--color-gradient-to)]">{t('statsTitle', language)}</h2>
        
        <div className="space-y-4 text-lg mb-6">
          <div className={`flex justify-between items-center bg-[--color-square-bg] p-3 rounded-lg ${updatedFields.has('totalGames') ? 'animate-stat-update' : ''}`}>
              <span className="font-medium text-[--color-text-secondary]">{t('totalGames', language)}</span>
              <span className="font-bold text-2xl text-[--color-text-primary]">{stats.totalGames}</span>
          </div>
          <div className={`flex justify-between items-center bg-[--color-square-bg] p-3 rounded-lg ${updatedFields.has('xWins') ? 'animate-stat-update' : ''}`}>
              <span className="font-medium text-[--color-player-x]">{t('xWins', language)}</span>
              <span className="font-bold text-2xl text-[--color-player-x]">{stats.xWins}</span>
          </div>
          <div className={`flex justify-between items-center bg-[--color-square-bg] p-3 rounded-lg ${updatedFields.has('oWins') ? 'animate-stat-update' : ''}`}>
              <span className="font-medium text-[--color-player-o]">{t('oWins', language)}</span>
              <span className="font-bold text-2xl text-[--color-player-o]">{stats.oWins}</span>
          </div>
            <div className={`flex justify-between items-center bg-[--color-square-bg] p-3 rounded-lg ${updatedFields.has('draws') ? 'animate-stat-update' : ''}`}>
              <span className="font-medium text-[--color-text-secondary]">{t('draws', language)}</span>
              <span className="font-bold text-2xl text-[--color-text-primary]">{stats.draws}</span>
          </div>
        </div>

        <div className="my-6">
          <h3 className="text-center text-sm font-medium text-[--color-text-secondary] mb-2">{t('winStreaks', language)}</h3>
          <div className="flex justify-around items-center bg-[--color-square-bg] p-3 rounded-lg">
            <div className="text-center">
              <div className={`font-bold text-3xl text-[--color-player-x] ${updatedFields.has('xStreak') ? 'animate-streak-update' : ''}`}>{stats.xStreak}</div>
              <div className="text-xs text-[--color-player-x]">{t('playerX', language)}</div>
            </div>
            <div className="text-center">
              <div className={`font-bold text-3xl text-[--color-player-o] ${updatedFields.has('oStreak') ? 'animate-streak-update' : ''}`}>{stats.oStreak}</div>
              <div className="text-xs text-[--color-player-o]">{t('playerO', language)}</div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
            <h3 className="text-center text-sm font-medium text-[--color-text-secondary] mb-2">{t('winRatio', language)}</h3>
            <div className="flex w-full h-4 bg-[--color-square-bg] rounded-full overflow-hidden" role="progressbar" aria-label={`Win ratio: X ${xWinPercentage.toFixed(0)}%, O ${oWinPercentage.toFixed(0)}%, Draws ${drawPercentage.toFixed(0)}%`}>
                <div style={{ width: `${xWinPercentage}%` }} className="bg-[--color-player-x] transition-all duration-500" title={`'X' Wins: ${xWinPercentage.toFixed(0)}%`}></div>
                <div style={{ width: `${oWinPercentage}%` }} className="bg-[--color-player-o] transition-all duration-500" title={`'O' Wins: ${oWinPercentage.toFixed(0)}%`}></div>
                <div style={{ width: `${drawPercentage}%` }} className="bg-slate-500 transition-all duration-500" title={`Draws: ${drawPercentage.toFixed(0)}%`}></div>
            </div>
        </div>

        {showResetConfirmation ? (
          <div className="text-center animate-fade-in mt-8 pt-6 border-t border-slate-700">
            <h3 className="text-lg font-semibold text-[--color-text-primary] mb-4">
              {t('resetStatsConfirmation', language)}
            </h3>
            <div className="flex justify-center gap-4">
              <button onClick={handleReset} className="w-28 py-2 px-4 rounded-lg bg-red-600 text-white font-semibold transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[--color-board-bg] focus:ring-red-500">
                {t('yesReset', language)}
              </button>
              <button onClick={() => setShowResetConfirmation(false)} className="w-28 py-2 px-4 rounded-lg bg-slate-600 text-white font-semibold transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[--color-board-bg] focus:ring-slate-500">
                {t('cancel', language)}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-8 pt-6 border-t border-slate-700">
            <button onClick={() => setShowResetConfirmation(true)} className="w-full py-3 px-4 rounded-lg bg-amber-600 text-white font-semibold transition-colors hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[--color-board-bg] focus:ring-amber-500">
              {t('resetStats', language)}
            </button>
          </div>
        )}

        <button 
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full text-[--color-text-secondary] hover:bg-[--color-square-hover] hover:text-[--color-text-primary] transition-colors"
          aria-label="Close statistics"
        >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default StatsModal;