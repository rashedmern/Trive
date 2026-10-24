export async function playNotificationSound(): Promise<void> {
  try {
    if (typeof window !== "undefined" && typeof Audio !== "undefined") {
      const audio = new Audio("/assets/sounds/bell.wav");
      void audio.play().catch(() => {});
    }
  } catch {
    // Graceful web fallback
  }
}

export function useNotificationBellSound(): { play: () => Promise<void> } {
  return { play: playNotificationSound };
}
