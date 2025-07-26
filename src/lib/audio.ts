
"use client";

// A cache to hold the Audio objects
const audioCache: { [key: string]: HTMLAudioElement } = {};

/**
 * Plays a sound from a given path.
 * It uses a cache to prevent re-creating Audio objects for the same sound.
 * @param src The path to the audio file (e.g., '/sounds/click.mp3')
 */
export const playSound = (src: string) => {
  if (typeof window === 'undefined') {
    return; // Don't run on server
  }

  try {
    let audio = audioCache[src];
    
    if (!audio) {
      audio = new Audio(src);
      audioCache[src] = audio;
    }

    // If the sound is already playing, stop it and restart from the beginning.
    // This is useful for rapid-fire sounds like typing.
    if (!audio.paused) {
      audio.pause();
      audio.currentTime = 0;
    }
    
    audio.play().catch(error => {
      // Autoplay was prevented. This is a common browser policy.
      // We can safely ignore this error.
      if (error.name !== 'NotAllowedError') {
        console.error(`Could not play sound: ${src}`, error);
      }
    });
  } catch (error) {
    console.error(`Error initializing or playing sound: ${src}`, error);
  }
};
