import React from 'react';

interface StatsButtonProps {
  onClick: () => void;
}

const StatsButton: React.FC<StatsButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-full bg-[--color-board-bg] text-[--color-text-secondary] hover:bg-[--color-square-hover] hover:text-[--color-text-primary] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[--color-background] focus:ring-[--color-accent]"
      aria-label="Open game statistics"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
      </svg>
    </button>
  );
};

export default StatsButton;
