import React from 'react';

interface CampusCareLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
  isMonochrome?: boolean;
}

export const CampusCareLogo: React.FC<CampusCareLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
  isMonochrome = false,
}) => {
  const iconDimensions = {
    sm: { width: 28, height: 28 },
    md: { width: 34, height: 34 },
    lg: { width: 44, height: 44 },
  }[size];

  const textStyles = {
    sm: { title: 'text-sm font-bold tracking-wider', sub: 'text-[9px] tracking-widest' },
    md: { title: 'text-base font-bold tracking-wider', sub: 'text-[10px] tracking-widest' },
    lg: { title: 'text-xl font-bold tracking-wider', sub: 'text-[11px] tracking-widest' },
  }[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision Geometric Architectural Logo Mark */}
      <div 
        className="relative flex items-center justify-center shrink-0 rounded-md transition-colors"
        style={{ width: iconDimensions.width, height: iconDimensions.height }}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Outer Technical Blueprint Marker Frame */}
          <rect
            x="3"
            y="3"
            width="42"
            height="42"
            rx="8"
            stroke="currentColor"
            strokeWidth="1.75"
            className="text-emerald-800/40 dark:text-emerald-400/30"
          />

          {/* Building Gable Roof / Architectural Pediment */}
          <path
            d="M12 21L24 11L36 21"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-emerald-900 dark:text-emerald-300"
          />

          {/* Campus Facade / Structural Pillars */}
          <line
            x1="16"
            y1="23"
            x2="16"
            y2="33"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-emerald-900/80 dark:text-emerald-400/70"
          />
          <line
            x1="24"
            y1="23"
            x2="24"
            y2="33"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-emerald-900/80 dark:text-emerald-400/70"
          />
          <line
            x1="32"
            y1="23"
            x2="32"
            y2="33"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-emerald-900/80 dark:text-emerald-400/70"
          />

          {/* Building Plinth / Base Foundation */}
          <path
            d="M11 35H37"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-emerald-900 dark:text-emerald-300"
          />

          {/* Location Pin Coordinate Apex (Architectural crosshair marker at top) */}
          <circle
            cx="24"
            cy="7"
            r="1.75"
            fill="currentColor"
            className="text-emerald-700 dark:text-emerald-400"
          />

          {/* Check / Resolution Precision Indicator Badge on Lower Right */}
          <circle
            cx="35"
            cy="35"
            r="8"
            fill="var(--bg-card, #ffffff)"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-emerald-700 dark:text-emerald-400"
          />
          <path
            d="M31.5 35L33.8 37.3L38.5 32.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-emerald-600 dark:text-emerald-400"
          />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col">
        <div className={`font-mono leading-none tracking-tight ${textStyles.title} text-[#18221c] dark:text-[#f1f5f2]`}>
          CAMPUS<span className="text-emerald-800 dark:text-emerald-400">CARE</span>
        </div>
        {showSubtitle && (
          <span className={`text-[9px] uppercase font-mono font-medium tracking-widest text-[#526359] dark:text-[#9cb1a5] mt-0.5`}>
            Campus Operations
          </span>
        )}
      </div>
    </div>
  );
};
