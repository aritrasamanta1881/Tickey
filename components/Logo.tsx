import React from 'react';

interface LogoProps {
  className?: string;
  isAnimated?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', isAnimated = false }) => {
  return (
    <div className={`flex flex-col items-center justify-center select-none pointer-events-none ${className} ${isAnimated ? 'animate-logo-trigger' : ''}`}>
      <svg
        width="120"
        height="120"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-2xl"
      >
        {/* Abstract Grid Background */}
        <rect x="10" y="10" width="80" height="80" rx="15" fill="white" fillOpacity="0.05" />
        <path d="M36.5 15V85" stroke="white" strokeOpacity="0.1" strokeWidth="2" strokeLinecap="round" />
        <path d="M63.5 15V85" stroke="white" strokeOpacity="0.1" strokeWidth="2" strokeLinecap="round" />
        <path d="M15 36.5H85" stroke="white" strokeOpacity="0.1" strokeWidth="2" strokeLinecap="round" />
        <path d="M15 63.5H85" stroke="white" strokeOpacity="0.1" strokeWidth="2" strokeLinecap="round" />

        {/* Stylized 'X' */}
        <path
          className="animate-pulse"
          d="M25 25L45 45M45 25L25 45"
          stroke="var(--color-player-x)"
          strokeWidth="8"
          strokeLinecap="round"
          style={{ animationDuration: '3s' }}
        />

        {/* Stylized 'O' */}
        <circle
          className="animate-bounce"
          cx="75"
          cy="75"
          r="10"
          stroke="var(--color-player-o)"
          strokeWidth="8"
          style={{ animationDuration: '4s' }}
        />

        {/* Stylized Checkmark / 'T' Hybrid */}
        <path
          d="M30 75L45 90L85 35"
          stroke="var(--color-accent)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="drop-shadow-[0_0_10px_var(--color-accent)]"
        />
      </svg>
      
      <h1 className="mt-[-20px] text-5xl xs:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-[var(--color-gradient-from)] via-[var(--color-accent)] to-[var(--color-gradient-to)] filter drop-shadow-lg">
        Tickey!
      </h1>
    </div>
  );
};

export default Logo;