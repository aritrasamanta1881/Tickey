
import React, { useState, useEffect } from 'react';
import { t, languages } from '../utils/translations.ts';
import type { ThemeName, GameMode, Language, BoardTheme } from '../types.ts';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSoundEnabled: boolean;
  onSoundToggle: () => void;
  volume: number;
  onVolumeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  theme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
  boardTheme: BoardTheme;
  onBoardThemeChange: (theme: BoardTheme) => void;
  onThemePreview: (theme: ThemeName | null) => void;
  isHapticEnabled: boolean;
  onHapticToggle: () => void;
  gameMode: GameMode | null;
  onQuitGame: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  boardGridColor: string;
  onBoardGridColorChange: (color: string) => void;
  boardGap: number;
  onBoardGapChange: (gap: number) => void;
  deviceId: string;
}

const THEME_NAMES: ThemeName[] = ['classic', 'forest', 'neon'];
const BOARD_THEMES: BoardTheme[] = ['modern', 'bubble', 'cyber', 'sketch'];

const isHapticSupported = typeof window !== 'undefined' && 'vibrate' in window.navigator;

const FullScreenLanguageSelector: React.FC<{
  currentLanguage: Language;
  onSelect: (lang: Language) => void;
  onClose: () => void;
}> = ({ currentLanguage, onSelect, onClose }) => {
  return (
    <div className="lang-menu-fullscreen" role="dialog" aria-modal="true" aria-labelledby="lang-menu-title">
      <button onClick={onClose} className="lang-menu-close-button" aria-label="Close language selection">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div className="flex flex-col items-center">
        <h2 id="lang-menu-title" className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-gradient-from)] to-[var(--color-gradient-to)]">
          {t('language', currentLanguage)}
        </h2>
        <div className="lang-menu-grid">
          {(Object.keys(languages) as Language[]).map(langKey => (
            <button
              key={langKey}
              onClick={() => onSelect(langKey)}
              className={`lang-menu-button ${currentLanguage === langKey ? 'lang-menu-button--active' : ''}`}
            >
              {languages[langKey]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isSoundEnabled,
  onSoundToggle,
  volume,
  onVolumeChange,
  theme,
  onThemeChange,
  boardTheme,
  onBoardThemeChange,
  onThemePreview,
  isHapticEnabled,
  onHapticToggle,
  gameMode,
  onQuitGame,
  language,
  onLanguageChange,
  boardGridColor,
  onBoardGridColorChange,
  boardGap,
  onBoardGapChange,
  deviceId,
}) => {
  const [showQuitConfirmation, setShowQuitConfirmation] = useState(false);
  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowQuitConfirmation(false);
      setCopyStatus(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLanguageSelect = (lang: Language) => {
    onLanguageChange(lang);
    setIsLanguageSelectorOpen(false);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(deviceId);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in"
      style={{ animationDuration: '0.2s' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div 
        className="bg-[--color-board-bg] p-8 rounded-lg shadow-2xl w-full max-w-sm text-white relative animate-pop-in max-h-[90vh] overflow-y-auto"
        style={{ animationDuration: '0.3s' }}
        onClick={(e) => e.stopPropagation()}
      >
        {isLanguageSelectorOpen && (
          <FullScreenLanguageSelector
            currentLanguage={language}
            onSelect={handleLanguageSelect}
            onClose={() => setIsLanguageSelectorOpen(false)}
          />
        )}
        
        {showQuitConfirmation ? (
          <div className="text-center animate-fade-in">
            <h3 id="settings-title" className="text-xl font-semibold text-[--color-text-primary] mb-6">
              {t('quitConfirmation', language)}
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={onQuitGame}
                className="w-28 py-2 px-4 rounded-lg bg-red-600 text-white font-semibold transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[--color-board-bg] focus:ring-red-500"
              >
                {t('yes', language)}
              </button>
              <button
                onClick={() => setShowQuitConfirmation(false)}
                className="w-28 py-2 px-4 rounded-lg bg-slate-600 text-white font-semibold transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[--color-board-bg] focus:ring-slate-500"
              >
                {t('no', language)}
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 id="settings-title" className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-gradient-from)] to-[var(--color-gradient-to)]">{t('settingsTitle', language)}</h2>
            
            <div className="flex items-center justify-between mb-6">
              <label htmlFor="sound-toggle" className="text-lg font-medium text-[--color-text-primary]">{t('soundEffects', language)}</label>
              <button
                id="sound-toggle"
                onClick={onSoundToggle}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[--color-board-bg] focus:ring-[--color-accent] ${isSoundEnabled ? 'bg-[--color-accent]' : 'bg-slate-600'}`}
                role="switch"
                aria-checked={isSoundEnabled}
              >
                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isSoundEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            {isHapticSupported && (
              <div className="flex items-center justify-between mb-6">
                <label htmlFor="haptic-toggle" className="text-lg font-medium text-[--color-text-primary]">{t('hapticFeedback', language)}</label>
                <button
                  id="haptic-toggle"
                  onClick={onHapticToggle}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[--color-board-bg] focus:ring-[--color-accent] ${isHapticEnabled ? 'bg-[--color-accent]' : 'bg-slate-600'}`}
                  role="switch"
                  aria-checked={isHapticEnabled}
                >
                  <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isHapticEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            )}

            <div className="flex flex-col mb-6">
              <label htmlFor="volume-slider" className="text-lg font-medium text-[--color-text-primary] mb-3">{t('volume', language)}</label>
              <input
                id="volume-slider"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={onVolumeChange}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[--color-accent]"
                disabled={!isSoundEnabled}
              />
            </div>

            <div className="mb-6">
              <label id="lang-label" className="text-lg font-medium text-[--color-text-primary] mb-3 block">{t('language', language)}</label>
              <button
                onClick={() => setIsLanguageSelectorOpen(true)}
                className="w-full bg-[--color-square-hover] text-[--color-text-primary] py-2 px-3 rounded-lg flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[--color-board-bg] focus:ring-[--color-accent]"
              >
                <span>{languages[language]}</span>
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </button>
            </div>

            <div className="mt-8 mb-8">
              <h3 className="text-lg font-medium text-[--color-text-primary] mb-3">{t('theme', language)}</h3>
              <div className="grid grid-cols-3 gap-3">
                {THEME_NAMES.map((name) => (
                  <button
                    key={name}
                    onClick={() => onThemeChange(name)}
                    onMouseEnter={() => onThemePreview(name)}
                    onMouseLeave={() => onThemePreview(null)}
                    className={`py-2 px-4 rounded-lg capitalize transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[--color-board-bg] focus:ring-[--color-accent] ${
                      theme === name
                        ? 'bg-[--color-accent] text-white font-semibold ring-2 ring-[--color-accent]'
                        : 'bg-[--color-square-hover] text-[--color-text-secondary] hover:bg-[--color-accent] hover:text-white'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 mb-8">
              <h3 className="text-lg font-medium text-[--color-text-primary] mb-3">{t('boardTheme', language)}</h3>
              <div className="grid grid-cols-2 gap-3">
                {BOARD_THEMES.map((bt) => (
                  <button
                    key={bt}
                    onClick={() => onBoardThemeChange(bt)}
                    className={`py-2 px-3 rounded-lg capitalize transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[--color-board-bg] focus:ring-[--color-accent] ${
                      boardTheme === bt
                        ? 'bg-[--color-accent] text-white font-semibold'
                        : 'bg-[--color-square-hover] text-[--color-text-secondary] hover:bg-[--color-accent] hover:text-white'
                    }`}
                  >
                    {bt}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-700">
              <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-gradient-from)] to-[var(--color-gradient-to)] mb-4">{t('boardCustomization', language)}</h3>
              
              <div className="flex items-center justify-between mb-6">
                <label htmlFor="grid-color" className="text-md font-medium text-[--color-text-primary]">{t('gridColor', language)}</label>
                <input 
                  id="grid-color"
                  type="color" 
                  value={boardGridColor} 
                  onChange={(e) => onBoardGridColorChange(e.target.value)}
                  className="w-10 h-10 border-none rounded cursor-pointer bg-transparent"
                />
              </div>

              <div className="flex flex-col mb-4">
                <div className="flex justify-between items-center mb-2">
                    <label htmlFor="square-gap" className="text-md font-medium text-[--color-text-primary]">{t('squareGap', language)}</label>
                    <span className="text-xs text-[--color-text-secondary]">{boardGap}px</span>
                </div>
                <input
                  id="square-gap"
                  type="range"
                  min="0"
                  max="24"
                  step="2"
                  value={boardGap}
                  onChange={(e) => onBoardGapChange(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[--color-accent]"
                />
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-700 text-center">
              <h3 className="text-sm font-bold text-[--color-text-secondary] mb-2 uppercase tracking-widest">{t('deviceId', language)}</h3>
              <div className="bg-black/20 p-3 rounded-lg flex items-center justify-between gap-3 border border-white/5">
                <code className="text-xs xs:text-sm font-mono text-[--color-accent] select-all break-all">{deviceId}</code>
                <button 
                  onClick={handleCopyId}
                  className="p-2 rounded-md hover:bg-white/10 transition-colors text-[--color-text-secondary]"
                  title="Copy Device ID"
                >
                  {copyStatus ? (
                    <span className="text-[10px] font-bold text-green-500 uppercase">{t('copied', language)}</span>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {gameMode && (
              <div className="mt-8 pt-6 border-t border-slate-700">
                <button
                  onClick={() => setShowQuitConfirmation(true)}
                  className="w-full py-3 px-4 rounded-lg bg-red-600 text-white font-semibold transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[--color-board-bg] focus:ring-red-500"
                >
                  {t('quitGame', language)}
                </button>
              </div>
            )}

            <button 
              onClick={onClose}
              className="absolute top-3 right-3 p-1 rounded-full text-[--color-text-secondary] hover:bg-[--color-square-hover] hover:text-[--color-text-primary] transition-colors"
            >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SettingsModal;
