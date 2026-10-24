// Trive Design System — TypeScript Theme Contracts
// Use these instead of raw hex strings throughout the app.

export const Colors = {
  // Backgrounds
  background: "#F8F9FA",
  backgroundDark: "#0F0F0F",

  // Surfaces
  surface: "#FFFFFF",
  surfaceDark: "#111111",
  surfaceMuted: "#F3F4F6",
  surfaceMutedDark: "#1C1C1E",

  // Brand / Accent
  accentPink: "#FF2D55",
  accentPinkLight: "#FECDD3",
  accentGreen: "#22C55E",
  accentGreenLight: "#BBF7D0",

  // Neutrals
  neutral900: "#111111",
  neutral800: "#1F2937",
  neutral700: "#374151",
  neutral600: "#4B5563",
  neutral500: "#6B7280",
  neutral400: "#9CA3AF",
  neutral300: "#D1D5DB",
  neutral200: "#E5E7EB",
  neutral100: "#F3F4F6",
  neutral50: "#F9FAFB",
} as const;

// Pastel card gradient pairs [from, to]
export const CardGradients = {
  green:    ["#DCFCE7", "#BBF7D0"] as [string, string],
  coral:    ["#FFE4E6", "#FECDD3"] as [string, string],
  peach:    ["#FEF3C7", "#FDE68A"] as [string, string],
  lavender: ["#E0E7FF", "#C7D2FE"] as [string, string],
} as const;

export type CardGradientKey = keyof typeof CardGradients;

// Border radius values (React Native numeric)
export const Radius = {
  card:    24,
  service: 20,
  pill:    9999,
  badge:   10,
  input:   14,
  sm:      8,
  md:      12,
  xl:      16,
  xxl:     24,
} as const;

// Spacing steps
export const Spacing = {
  xs:      4,
  sm:      8,
  md:      12,
  lg:      16,
  xl:      20,
  xxl:     24,
  pageH:   16,
  section: 24,
  cardP:   16,
  gap:     12,
} as const;

// Reusable shadow presets
export const Shadows = {
  sm: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  card: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  dock: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
  pinkGlow: {
    shadowColor: "#FF2D55",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;

// Typography size scale (React Native points)
export const FontSize = {
  xs:   11,
  sm:   12,
  base: 14,
  md:   16,
  lg:   18,
  xl:   20,
  xxl:  24,
  hero: 28,
} as const;

export const FontWeight = {
  regular:   "400" as const,
  medium:    "500" as const,
  semibold:  "600" as const,
  bold:      "700" as const,
  extrabold: "800" as const,
} as const;
