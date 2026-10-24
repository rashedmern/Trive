import React from "react";

interface TriveLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export const TriveLogo: React.FC<TriveLogoProps> = ({
  size = 40,
  className = "",
  showText = false,
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Official Standalone Pin + Compass Needle Logo */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-md"
      >
        <defs>
          <linearGradient id="trivePinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="40%" stopColor="#DC2626" />
            <stop offset="75%" stopColor="#991B1B" />
            <stop offset="100%" stopColor="#881337" />
          </linearGradient>

          <linearGradient id="triveNeedleLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F87171" />
            <stop offset="60%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>

          <linearGradient id="triveNeedleDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="50%" stopColor="#B91C1C" />
            <stop offset="100%" stopColor="#881337" />
          </linearGradient>

          <radialGradient id="triveGroundShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#881337" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#881337" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#881337" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ground Contact Shadow */}
        <ellipse cx="256" cy="482" rx="76" ry="14" fill="url(#triveGroundShadow)" />

        {/* Outer Map Location Pin */}
        <path
          d="M 256 470 C 220 398 116 268 116 182 A 140 140 0 1 1 396 182 C 396 268 292 398 256 470 Z"
          fill="url(#trivePinGrad)"
        />

        {/* Top Bulb Subtle Gloss Highlight */}
        <path
          d="M 148 144 C 174 92 212 66 256 66 C 300 66 338 92 364 144 C 334 104 298 84 256 84 C 214 84 178 104 148 144 Z"
          fill="#FFFFFF"
          opacity="0.18"
        />

        {/* Center Core: Pure Solid White Circle Cutout */}
        <circle cx="256" cy="182" r="68" fill="#FFFFFF" />

        {/* Inner Compass Needle Group (Rotated 45° to Upper-Right) */}
        <g transform="rotate(45, 256, 182)">
          {/* Left Facet (Illuminated Red) */}
          <path
            d="M 256 134 L 224 216 L 256 196 Z"
            fill="url(#triveNeedleLight)"
          />

          {/* Right Facet (Deep Crimson Shadow) */}
          <path
            d="M 256 134 L 256 196 L 288 216 Z"
            fill="url(#triveNeedleDark)"
          />

          {/* Central Facet Seam Line */}
          <line
            x1="256"
            y1="134"
            x2="256"
            y2="196"
            stroke="#FFFFFF"
            strokeWidth="1.25"
            strokeLinecap="round"
            opacity="0.45"
          />
        </g>
      </svg>

      {showText && (
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-black text-xl tracking-tight text-white">
              TRIVE
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
              PRO
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 font-medium tracking-wide">
            SMART FLEET &amp; LOGISTICS
          </p>
        </div>
      )}
    </div>
  );
};
