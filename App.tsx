
import React, { useState, useCallback, useEffect, useRef } from 'react';
import Board from './components/Board.tsx';
import GameInfo from './components/GameInfo.tsx';
import ResetButton from './components/ResetButton.tsx';
import GameModeSelector from './components/GameModeSelector.tsx';
import SettingsButton from './components/SettingsButton.tsx';
import SettingsModal from './components/SettingsModal.tsx';
import StatsButton from './components/StatsButton.tsx';
import StatsModal from './components/StatsModal.tsx';
import TipsButton from './components/TipsButton.tsx';
import Confetti from './components/Confetti.tsx';
import GameResultOverlay from './components/GameResultOverlay.tsx';
import Logo from './components/Logo.tsx';
import { t } from './utils/translations.ts';
import type { SquareValue, Player, GameMode, AIDifficulty, ThemeName, BoardTheme, GameStats, Language } from './types.ts';

// --- Constants ---
const humanPlayer: Player = 'X';
const aiPlayer: Player = 'O';

const initialStats: GameStats = {
  totalGames: 0,
  xWins: 0,
  oWins: 0,
  draws: 0,
  xStreak: 0,
  oStreak: 0,
};

const themes: Record<ThemeName, Record<string, string>> = {
  classic: {
    '--color-background': '#0f172a',
    '--color-text-primary': '#e2e8f0',
    '--color-text-secondary': '#94a3b8',
    '--color-player-x': '#22d3ee',
    '--color-player-o': '#facc15',
    '--color-accent': '#7c3aed',
    '--color-accent-hover': '#6d28d9',
    '--color-board-bg': '#1f2937',
    '--color-square-bg': '#0f172a',
    '--color-square-hover': '#374151',
    '--color-win-bg': '#16a34a',
    '--color-gradient-from': '#22d3ee',
    '--color-gradient-to': '#8b5cf6',
  },
  forest: {
    '--color-background': '#1a2e27',
    '--color-text-primary': '#dce2d9',
    '--color-text-secondary': '#9eac9b',
    '--color-player-x': '#84cc16',
    '--color-player-o': '#f59e0b',
    '--color-accent': '#10b981',
    '--color-accent-hover': '#059669',
    '--color-board-bg': '#223c33',
    '--color-square-bg': '#1a2e27',
    '--color-square-hover': '#2f4d40',
    '--color-win-bg': '#10b981',
    '--color-gradient-from': '#84cc16',
    '--color-gradient-to': '#10b981',
  },
  neon: {
    '--color-background': '#111117',
    '--color-text-primary': '#d3d4da',
    '--color-text-secondary': '#898991',
    '--color-player-x': '#f472b6',
    '--color-player-o': '#00ffff',
    '--color-accent': '#eab308',
    '--color-accent-hover': '#ca8a04',
    '--color-board-bg': '#1b1b22',
    '--color-square-bg': '#111117',
    '--color-square-hover': '#292933',
    '--color-win-bg': '#f472b6',
    '--color-gradient-from': '#f472b6',
    '--color-gradient-to': '#00ffff',
  },
};

// --- Helper Functions ---
const generateDeviceId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segment = () => {
    const randomValues = new Uint32Array(4);
    window.crypto.getRandomValues(randomValues);
    return Array.from(randomValues)
      .map(v => chars[v % chars.length])
      .join('');
  };
  return `${segment()}-${segment()}-${segment()}`;
};

// --- Sound Effects Engine ---
let audioContext: AudioContext | null = null;
const getAudioContext = (): AudioContext | null => {
  if (typeof window !== 'undefined' && !audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

interface WinnerInfo {
  winner: Player | null;
  line: number[] | null;
}

const App: React.FC = () => {
  const [deviceId, setDeviceId] = useState<string>('');
  const [isInitializing, setIsInitializing] = useState(true);

  const [board, setBoard] = useState<SquareValue[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | 'Draw' | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [isAiTurn, setIsAiTurn] = useState<boolean>(false);
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty | null>(null);
  const [startingPlayer, setStartingPlayer] = useState<Player>('X');
  const [aiHasMoved, setAiHasMoved] = useState<boolean>(false);
  const [showResultOverlay, setShowResultOverlay] = useState<boolean>(false);
  const [showActionButtons, setShowActionButtons] = useState<boolean>(false);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [theme, setTheme] = useState<ThemeName>('classic');
  const [boardTheme, setBoardTheme] = useState<BoardTheme>('modern');
  const [isHapticEnabled, setIsHapticEnabled] = useState(true);
  const [language, setLanguage] = useState<Language>('en');

  const [boardGridColor, setBoardGridColor] = useState<string>('');
  const [boardGap, setBoardGap] = useState<number>(12);

  const [stats, setStats] = useState<GameStats>(initialStats);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  
  const [isViewFading, setIsViewFading] = useState(false);
  const [logoAnimActive, setLogoAnimActive] = useState(false);
  const [suggestedMove, setSuggestedMove] = useState<number | null>(null);
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  const moveInProgress = useRef(false);

  const getStorageKey = useCallback((key: string, id: string = deviceId) => {
    return id ? `tickey-${id}-${key}` : `tickey-${key}`;
  }, [deviceId]);

  // Initial Device Setup
  useEffect(() => {
    let currentId = localStorage.getItem('tickey-device-id');
    const isFirstRun = !currentId;

    if (isFirstRun) {
      currentId = generateDeviceId();
      localStorage.setItem('tickey-device-id', currentId);

      // Attempt Legacy Migration
      const legacyKeys = [
        'theme', 'board-theme', 'stats', 'language', 
        'board-grid-color', 'board-gap', 'sound-enabled', 'volume', 'haptic-enabled'
      ];
      
      legacyKeys.forEach(k => {
        const legacyVal = localStorage.getItem(`tickey-${k}`);
        if (legacyVal !== null) {
          localStorage.setItem(`tickey-${currentId}-${k}`, legacyVal);
          localStorage.removeItem(`tickey-${k}`);
        }
      });
    }

    setDeviceId(currentId!);
    
    // Load Isolated Data
    try {
      const id = currentId!;
      const load = (key: string) => localStorage.getItem(`tickey-${id}-${key}`);

      const storedTheme = load('theme');
      if (storedTheme && themes[storedTheme as ThemeName]) {
        setTheme(storedTheme as ThemeName);
        setBoardGridColor(themes[storedTheme as ThemeName]['--color-board-bg']);
      }

      const storedBoardTheme = load('board-theme');
      if (storedBoardTheme) setBoardTheme(storedBoardTheme as BoardTheme);

      const storedStats = load('stats');
      if (storedStats) setStats(JSON.parse(storedStats));

      const storedLang = load('language');
      if (storedLang) setLanguage(storedLang as Language);

      const storedGridColor = load('board-grid-color');
      if (storedGridColor) setBoardGridColor(storedGridColor);

      const storedGap = load('board-gap');
      if (storedGap) setBoardGap(parseInt(storedGap, 10));

      const storedSound = load('sound-enabled');
      if (storedSound !== null) setIsSoundEnabled(storedSound === 'true');

      const storedVol = load('volume');
      if (storedVol !== null) setVolume(parseFloat(storedVol));

      const storedHaptic = load('haptic-enabled');
      if (storedHaptic !== null) setIsHapticEnabled(storedHaptic === 'true');

    } catch (e) {
      console.error("Storage loading error", e);
    }

    setIsInitializing(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
        setShowSplashScreen(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Sync Stats
  useEffect(() => {
    if (!isInitializing && deviceId) {
      localStorage.setItem(getStorageKey('stats'), JSON.stringify(stats));
    }
  }, [stats, isInitializing, deviceId, getStorageKey]);
  
  // Sync Theme
  useEffect(() => {
    if (!isInitializing && deviceId) {
      const root = document.documentElement;
      const selectedTheme = themes[theme];
      for (const [key, value] of Object.entries(selectedTheme)) {
        root.style.setProperty(key, value as string);
      }
      
      if (!localStorage.getItem(getStorageKey('board-grid-color'))) {
          setBoardGridColor(selectedTheme['--color-board-bg']);
      }
      localStorage.setItem(getStorageKey('theme'), theme);
    }
  }, [theme, isInitializing, deviceId, getStorageKey]);

  // Sync Board Settings
  useEffect(() => {
    if (!isInitializing && deviceId) {
      const root = document.documentElement;
      if (boardGridColor) root.style.setProperty('--board-grid-color', boardGridColor);
      root.style.setProperty('--board-gap', `${boardGap}px`);
      
      localStorage.setItem(getStorageKey('board-grid-color'), boardGridColor);
      localStorage.setItem(getStorageKey('board-gap'), boardGap.toString());
      localStorage.setItem(getStorageKey('board-theme'), boardTheme);
    }
  }, [boardGridColor, boardGap, boardTheme, isInitializing, deviceId, getStorageKey]);

  // Sync Global Toggles
  useEffect(() => {
    if (!isInitializing && deviceId) {
      localStorage.setItem(getStorageKey('language'), language);
      localStorage.setItem(getStorageKey('sound-enabled'), isSoundEnabled.toString());
      localStorage.setItem(getStorageKey('volume'), volume.toString());
      localStorage.setItem(getStorageKey('haptic-enabled'), isHapticEnabled.toString());
    }
  }, [language, isSoundEnabled, volume, isHapticEnabled, isInitializing, deviceId, getStorageKey]);

  useEffect(() => {
    moveInProgress.current = false;
  }, [board]);

  const triggerLogoAnimation = useCallback(() => {
    setLogoAnimActive(true);
    setTimeout(() => setLogoAnimActive(false), 600);
  }, []);

  const playSound = useCallback((type: 'click' | 'win' | 'draw') => {
    if (!isSoundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;
    gainNode.gain.setValueAtTime(volume * 0.2, now);

    switch (type) {
      case 'click':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, now);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
        oscillator.start(now);
        oscillator.stop(now + 0.1);
        break;
      case 'win':
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(440, now);
        oscillator.frequency.linearRampToValueAtTime(880, now + 0.2);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
        oscillator.start(now);
        oscillator.stop(now + 0.3);
        break;
      case 'draw':
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(330, now);
        oscillator.frequency.linearRampToValueAtTime(220, now + 0.2);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
        oscillator.start(now);
        oscillator.stop(now + 0.3);
        break;
    }
  }, [isSoundEnabled, volume]);

  const triggerHaptics = useCallback((type: 'click' | 'win' | 'draw') => {
    if (!isHapticEnabled || !window.navigator.vibrate) return;
    switch (type) {
      case 'click': window.navigator.vibrate(50); break;
      case 'win': window.navigator.vibrate([100, 30, 100]); break;
      case 'draw': window.navigator.vibrate([75, 50, 75]); break;
    }
  }, [isHapticEnabled]);

  const calculateWinner = useCallback((squares: SquareValue[]): WinnerInfo => {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a] as Player, line: lines[i] };
      }
    }
    return { winner: null, line: null };
  }, []);
  
  useEffect(() => {
    if (winner) {
      setShowResultOverlay(true);
      const timer = setTimeout(() => {
        setShowResultOverlay(false);
        setShowActionButtons(true);
      }, 2500);

      setStats(prevStats => {
        const newStats = { ...prevStats, totalGames: prevStats.totalGames + 1 };
        if (winner === 'X') {
          newStats.xWins += 1; newStats.xStreak += 1; newStats.oStreak = 0;
        } else if (winner === 'O') {
          newStats.oWins += 1; newStats.oStreak += 1; newStats.xStreak = 0;
        } else if (winner === 'Draw') {
          newStats.draws += 1; newStats.xStreak = 0; newStats.oStreak = 0;
        }
        return newStats;
      });
      return () => clearTimeout(timer);
    }
  }, [winner]);

  const handleSquareClick = useCallback((index: number) => {
    if (winner || board[index] || moveInProgress.current) return;
    moveInProgress.current = true;
    setSuggestedMove(null);

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    playSound('click');
    triggerHaptics('click');

    const { winner: newWinner, line: newLine } = calculateWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
      setWinningLine(newLine);
      playSound('win');
      triggerHaptics('win');
    } else if (newBoard.every(square => square !== null)) {
      setWinner('Draw');
      playSound('draw');
      triggerHaptics('draw');
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  }, [board, currentPlayer, winner, calculateWinner, playSound, triggerHaptics]);

  const quitAndResetToMenu = useCallback(() => {
    setIsViewFading(true);
    setTimeout(() => {
      setBoard(Array(9).fill(null));
      setCurrentPlayer('X');
      setWinner(null);
      setWinningLine(null);
      setIsAiTurn(false);
      setGameMode(null);
      setAiDifficulty(null);
      setStartingPlayer('X');
      setAiHasMoved(false);
      setSuggestedMove(null);
      setShowActionButtons(false);
      setShowResultOverlay(false);
      setIsViewFading(false);
    }, 300);
  }, []);

  const restartGame = useCallback(() => {
    setIsViewFading(true);
    setTimeout(() => {
      setBoard(Array(9).fill(null));
      setCurrentPlayer(startingPlayer);
      setWinner(null);
      setWinningLine(null);
      setIsAiTurn(false);
      setStartingPlayer(prev => prev === 'X' ? 'O' : 'X');
      setAiHasMoved(false);
      setSuggestedMove(null);
      setShowActionButtons(false);
      setShowResultOverlay(false);
      setIsViewFading(false);
    }, 300);
  }, [startingPlayer]);
  
  const previewTheme = (previewThemeName: ThemeName | null) => {
    const root = document.documentElement;
    const themeToApply = previewThemeName ? themes[previewThemeName] : themes[theme];
    for (const [key, value] of Object.entries(themeToApply)) {
        root.style.setProperty(key, value as string);
    }
  };
  
  const handleSettingsClose = () => {
    previewTheme(null);
    setIsSettingsOpen(false);
  };
  
  const handleQuitGame = () => {
    quitAndResetToMenu();
    handleSettingsClose();
  };
  
  const handleResetStats = () => setStats(initialStats);

  const minimax = useCallback((newBoard: SquareValue[], depth: number, isMaximizing: boolean): number => {
    const { winner: gameWinner } = calculateWinner(newBoard);
    if (gameWinner === aiPlayer) return 100 - depth;
    if (gameWinner === humanPlayer) return depth - 100;
    if (newBoard.every(square => square !== null)) return 0;

    const emptySquares = newBoard.map((val, idx) => (val === null ? idx : null)).filter((v): v is number => v !== null);

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (const i of emptySquares) {
            const tempBoard = [...newBoard];
            tempBoard[i] = aiPlayer;
            bestScore = Math.max(bestScore, minimax(tempBoard, depth + 1, false));
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (const i of emptySquares) {
            const tempBoard = [...newBoard];
            tempBoard[i] = humanPlayer;
            bestScore = Math.min(bestScore, minimax(tempBoard, depth + 1, true));
        }
        return bestScore;
    }
  }, [calculateWinner]);

  const handleHintClick = useCallback(() => {
    const emptySquares = board.map((val, idx) => (val === null ? idx : null)).filter((v): v is number => v !== null);
    if (emptySquares.length === 0) return;
    let bestScore = Infinity;
    let bestMove = -1;
    for (const i of emptySquares) {
        const tempBoard = [...board];
        tempBoard[i] = humanPlayer;
        const score = minimax(tempBoard, 0, true);
        if (score < bestScore) {
            bestScore = score; bestMove = i;
        }
    }
    setSuggestedMove(bestMove === -1 ? emptySquares[0] : bestMove);
  }, [board, minimax]);

  useEffect(() => {
    if (gameMode === 'pva' && currentPlayer === aiPlayer && !winner && aiDifficulty) {
      setIsAiTurn(true);
      if (!aiHasMoved) setAiHasMoved(true);

      const findAiMove = (squares: SquareValue[], difficulty: AIDifficulty): number => {
        const empty = squares.map((v, i) => (v === null ? i : null)).filter((v): v is number => v !== null);
        if (empty.length === 0) return -1;

        switch (difficulty) {
          case 'easy': return empty[Math.floor(Math.random() * empty.length)];
          case 'medium': {
            for (const i of empty) {
              const temp = [...squares]; temp[i] = aiPlayer;
              if (calculateWinner(temp).winner === aiPlayer) return i;
            }
            for (const i of empty) {
              const temp = [...squares]; temp[i] = humanPlayer;
              if (calculateWinner(temp).winner === humanPlayer) return i;
            }
            if (squares[4] === null) return 4;
            const corners = [0, 2, 6, 8].filter(i => squares[i] === null);
            if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];
            return empty[Math.floor(Math.random() * empty.length)];
          }
          case 'hard': {
            if (empty.length === 9) {
                const preferred = [0, 2, 4, 6, 8];
                return preferred[Math.floor(Math.random() * preferred.length)];
            }
            let bestS = -Infinity; let bestM = -1;
            for (const i of empty) {
                const temp = [...squares]; temp[i] = aiPlayer;
                const score = minimax(temp, 0, false);
                if (score > bestS) { bestS = score; bestM = i; }
            }
            return bestM === -1 ? empty[0] : bestM;
          }
        }
      };

      const delay = aiDifficulty === 'hard' ? 100 : aiDifficulty === 'medium' ? 250 : 400;
      const timer = setTimeout(() => {
        const move = findAiMove(board, aiDifficulty);
        if (move !== -1) handleSquareClick(move);
        setIsAiTurn(false);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [gameMode, currentPlayer, winner, board, handleSquareClick, calculateWinner, aiDifficulty, aiHasMoved, minimax]);

  const startGame = useCallback((mode: GameMode, difficulty?: AIDifficulty) => {
    setIsViewFading(true);
    setTimeout(() => {
      setGameMode(mode);
      setAiDifficulty(difficulty || null);
      setBoard(Array(9).fill(null));
      setCurrentPlayer(startingPlayer);
      setWinner(null); setWinningLine(null);
      setIsAiTurn(false); setAiHasMoved(false);
      setStartingPlayer(prev => prev === 'X' ? 'O' : 'X');
      setShowActionButtons(false); setShowResultOverlay(false);
      setIsViewFading(false);
    }, 300);
  }, [startingPlayer]);

  if (showSplashScreen || isInitializing) {
    return (
      <div className="min-h-screen bg-[--color-background] flex flex-col items-center justify-center p-4 font-sans text-center">
        <Logo className="animate-pop-in" />
        <p className="text-[--color-text-secondary] mt-4 text-lg animate-fade-in" style={{ animationDelay: '0.4s' }}>
          With ❤️ By ARITRA
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[--color-background] text-[--color-text-primary] flex flex-col items-center justify-center p-2 xs:p-4 font-sans relative overflow-hidden animate-fade-in">
      {(winner === 'X' || winner === 'O') && <Confetti winner={winner} />}
      {showResultOverlay && <GameResultOverlay winner={winner} language={language} />}

      <div className="absolute top-2 right-2 xs:top-4 xs:right-4 z-10 flex items-center gap-1.5 xs:gap-2">
        {gameMode === 'pva' && aiHasMoved && !winner && currentPlayer === humanPlayer && (
          <TipsButton onClick={handleHintClick} />
        )}
        <StatsButton onClick={() => { setIsStatsModalOpen(true); triggerLogoAnimation(); }} />
        <SettingsButton onClick={() => { setIsSettingsOpen(true); triggerLogoAnimation(); }} />
      </div>
       <SettingsModal
        isOpen={isSettingsOpen}
        onClose={handleSettingsClose}
        isSoundEnabled={isSoundEnabled}
        onSoundToggle={() => setIsSoundEnabled(prev => !prev)}
        volume={volume}
        onVolumeChange={(e) => setVolume(parseFloat(e.target.value))}
        theme={theme}
        onThemeChange={setTheme}
        boardTheme={boardTheme}
        onBoardThemeChange={setBoardTheme}
        onThemePreview={previewTheme}
        isHapticEnabled={isHapticEnabled}
        onHapticToggle={() => setIsHapticEnabled(prev => !prev)}
        gameMode={gameMode}
        onQuitGame={handleQuitGame}
        language={language}
        onLanguageChange={setLanguage}
        boardGridColor={boardGridColor}
        onBoardGridColorChange={setBoardGridColor}
        boardGap={boardGap}
        onBoardGapChange={setBoardGap}
        deviceId={deviceId}
      />
      <StatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        stats={stats}
        onResetStats={handleResetStats}
        language={language}
      />

      <header className="mb-4 xs:mb-8 text-center px-4">
        <Logo isAnimated={logoAnimActive} />
        <p className="text-[--color-text-secondary] mt-1 text-sm xs:text-base">{t('subtitle', language)}</p>
      </header>
      
      <main className="flex flex-col items-center w-full max-w-md">
        {gameMode ? (
          <div className={`flex flex-col items-center w-full ${isViewFading ? 'animate-fade-out' : 'animate-fade-in'}`}>
            <GameInfo winner={winner} currentPlayer={currentPlayer} gameMode={gameMode} isAiTurn={isAiTurn} stats={stats} language={language} />
            <Board squares={board} onSquareClick={handleSquareClick} winner={winner} isLocked={isAiTurn} winningLine={winningLine} suggestedMove={suggestedMove} isDraw={winner === 'Draw'} currentPlayer={currentPlayer} boardTheme={boardTheme} />
            <ResetButton onReset={restartGame} onQuit={quitAndResetToMenu} winner={winner} language={language} visible={showActionButtons} />
          </div>
        ) : (
          <div className={`w-full ${isViewFading ? 'animate-fade-out' : 'animate-fade-in'}`}>
            <GameModeSelector onSelectMode={startGame} isSoundEnabled={isSoundEnabled} onSoundToggle={() => setIsSoundEnabled(prev => !prev)} language={language} />
          </div>
        )}
      </main>

      <footer className="mt-12 mb-4 animate-fade-in" style={{ animationDelay: '0.8s' }}>
        <p className="text-xl xs:text-2xl font-black tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-yellow-500 to-cyan-500 hover:scale-110 transition-transform cursor-pointer hover:animate-wiggle text-center">
          With ❤️ By ARITRA
        </p>
      </footer>
    </div>
  );
};

export default App;
