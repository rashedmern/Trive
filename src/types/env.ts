/**
 * src/types/env.ts
 *
 * Runtime validation of all EXPO_PUBLIC_* environment variables.
 * Throws at startup (not silently) if a required key is missing,
 * so misconfigured builds fail fast instead of failing at runtime.
 *
 * Rules (AGENTS.md):
 * - Only EXPO_PUBLIC_* keys are safe for the client bundle.
 * - Zero `any`.
 */

export interface AppEnv {
  /** Clerk publishable key — starts with "pk_" */
  clerkPublishableKey: string;
  /** Sanity project ID (read-only public) */
  sanityProjectId: string;
  /** PostHog project API key */
  postHogApiKey: string;
  /** PostHog host — defaults to https://us.i.posthog.com */
  postHogHost: string;
}

function checkEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(
      `[Trive] Missing required environment variable: ${name}\n` +
        `Copy .env.example to .env.local and fill in all values.`
    );
  }
  return value;
}

/**
 * Validated env singleton. Import this instead of accessing
 * process.env directly anywhere in the app.
 */
export const Env: AppEnv = {
  clerkPublishableKey: checkEnv(
    process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
    "EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY"
  ),
  sanityProjectId: checkEnv(
    process.env.EXPO_PUBLIC_SANITY_PROJECT_ID,
    "EXPO_PUBLIC_SANITY_PROJECT_ID"
  ),
  postHogApiKey: checkEnv(
    process.env.EXPO_PUBLIC_POSTHOG_API_KEY,
    "EXPO_PUBLIC_POSTHOG_API_KEY"
  ),
  postHogHost:
    process.env.EXPO_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
};
