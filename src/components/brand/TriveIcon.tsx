import React from "react";
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Ellipse,
  Path,
  Circle,
  G,
  Line,
} from "react-native-svg";

interface TriveIconProps {
  size?: number;
}

export function TriveIcon({ size = 36 }: TriveIconProps) {
  return (
    <Svg viewBox="0 0 512 512" width={size} height={size}>
      <Defs>
        <LinearGradient id="pinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#EF4444" />
          <Stop offset="40%" stopColor="#DC2626" />
          <Stop offset="75%" stopColor="#991B1B" />
          <Stop offset="100%" stopColor="#881337" />
        </LinearGradient>

        <LinearGradient id="needleLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#F87171" />
          <Stop offset="60%" stopColor="#EF4444" />
          <Stop offset="100%" stopColor="#DC2626" />
        </LinearGradient>

        <LinearGradient id="needleDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#DC2626" />
          <Stop offset="50%" stopColor="#B91C1C" />
          <Stop offset="100%" stopColor="#881337" />
        </LinearGradient>

        <RadialGradient id="groundShadow" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#881337" stopOpacity={0.35} />
          <Stop offset="60%" stopColor="#881337" stopOpacity={0.12} />
          <Stop offset="100%" stopColor="#881337" stopOpacity={0} />
        </RadialGradient>
      </Defs>

      {/* Ground Contact Shadow */}
      <Ellipse cx={256} cy={482} rx={76} ry={14} fill="url(#groundShadow)" />

      {/* Outer Map Location Pin */}
      <Path
        d="M 256 470 C 220 398 116 268 116 182 A 140 140 0 1 1 396 182 C 396 268 292 398 256 470 Z"
        fill="url(#pinGradient)"
      />

      {/* Top Bulb Subtle Gloss Highlight */}
      <Path
        d="M 148 144 C 174 92 212 66 256 66 C 300 66 338 92 364 144 C 334 104 298 84 256 84 C 214 84 178 104 148 144 Z"
        fill="#FFFFFF"
        opacity={0.18}
      />

      {/* Center Core: Pure Solid White Circle Cutout */}
      <Circle cx={256} cy={182} r={68} fill="#FFFFFF" />

      {/* Inner Compass Needle Group */}
      <G rotation={45} origin="256, 182">
        {/* Left Facet */}
        <Path d="M 256 134 L 224 216 L 256 196 Z" fill="url(#needleLight)" />

        {/* Right Facet */}
        <Path d="M 256 134 L 256 196 L 288 216 Z" fill="url(#needleDark)" />

        {/* Central Facet Seam Line */}
        <Line
          x1={256}
          y1={134}
          x2={256}
          y2={196}
          stroke="#FFFFFF"
          strokeWidth={1.25}
          strokeLinecap="round"
          opacity={0.45}
        />
      </G>
    </Svg>
  );
}
