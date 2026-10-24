import { createAudioPlayer, useAudioPlayer } from "expo-audio";
import { useCallback } from "react";
import bellAsset from "../../assets/sounds/bell.wav";

let globalBellPlayer: ReturnType<typeof createAudioPlayer> | null = null;

/**
 * Standalone function to trigger notification chime.
 * Safe for use anywhere without React hooks.
 */
export async function playNotificationSound(): Promise<void> {
  try {
    if (!globalBellPlayer) {
      globalBellPlayer = createAudioPlayer(bellAsset);
    }
    await globalBellPlayer.seekTo(0);
    globalBellPlayer.play();
  } catch {
    // Graceful fallback if device audio is muted or unavailable
  }
}

/**
 * React hook to manage notification bell sound playback with automatic lifecycle management.
 */
export function useNotificationBellSound(): { play: () => Promise<void> } {
  const player = useAudioPlayer(bellAsset);

  const play = useCallback(async (): Promise<void> => {
    try {
      await player.seekTo(0);
      player.play();
    } catch {
      // Graceful fallback
    }
  }, [player]);

  return { play };
}
