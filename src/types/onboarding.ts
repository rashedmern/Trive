import type { CardGradientKey } from "@/constants/theme";

export interface OnboardingSlide {
  id: string;
  tag: string;
  title: string;
  description: string;
  badgeText: string;
  badgeBg: string;
  badgeTextColor: string;
  iconName: string;
  gradientKey: CardGradientKey;
}
