const SETTINGS_KEY = "settings";

let audioContext;

function getVolume() {
  const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");

  const volume = Number(settings.sound ?? 50);

  return Math.max(0, Math.min(100, volume)) / 100;
}

function getAudioContext() {
  if (!audioContext) {
    audioContext = new AudioContext();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  return audioContext;
}

function playTone({
  frequency,
  duration,
  type = "sine",
  volume = 1,
  startFrequency,
  endFrequency,
  delay = 0,
}) {
  const masterVolume = getVolume();

  if (masterVolume === 0) {
    return;
  }

  const context = getAudioContext();

  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  const start = context.currentTime + delay;

  oscillator.type = type;

  oscillator.frequency.setValueAtTime(startFrequency ?? frequency, start);

  if (endFrequency !== undefined) {
    oscillator.frequency.exponentialRampToValueAtTime(
      endFrequency,
      start + duration,
    );
  }

  gainNode.gain.setValueAtTime(0, start);

  gainNode.gain.linearRampToValueAtTime(volume * masterVolume, start + 0.01);

  gainNode.gain.exponentialRampToValueAtTime(0.001, start + duration);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start(start);
  oscillator.stop(start + duration);
}

function playSequence(notes) {
  const masterVolume = getVolume();

  if (masterVolume === 0) {
    return;
  }

  const context = getAudioContext();
  const start = context.currentTime;

  notes.forEach(
    ({ frequency, duration, delay = 0, type = "sine", volume = 0.15 }) => {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      const noteStart = start + delay;

      oscillator.type = type;

      oscillator.frequency.setValueAtTime(frequency, noteStart);

      gainNode.gain.setValueAtTime(0, noteStart);

      gainNode.gain.linearRampToValueAtTime(
        volume * masterVolume,
        noteStart + 0.01,
      );

      gainNode.gain.exponentialRampToValueAtTime(0.001, noteStart + duration);

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.start(noteStart);
      oscillator.stop(noteStart + duration);
    },
  );
}

function playSelect() {
  playTone({
    frequency: 520,
    duration: 0.08,
    volume: 0.12,
  });
}

function playPairSelect() {
  playTone({
    frequency: 680,
    duration: 0.1,
    volume: 0.14,
  });
}

function playValidPair() {
  playSequence([
    {
      frequency: 523.25,
      duration: 0.12,
      delay: 0,
      volume: 0.14,
    },
    {
      frequency: 659.25,
      duration: 0.16,
      delay: 0.08,
      volume: 0.16,
    },
    {
      frequency: 783.99,
      duration: 0.22,
      delay: 0.16,
      volume: 0.18,
    },
  ]);
}

function playInvalidPair() {
  playTone({
    frequency: 180,
    duration: 0.18,
    type: "triangle",
    volume: 0.16,
    startFrequency: 220,
    endFrequency: 120,
  });
}

function playErase() {
  playTone({
    frequency: 360,
    duration: 0.12,
    type: "triangle",
    volume: 0.12,
    startFrequency: 500,
    endFrequency: 220,
  });
}

function playWin() {
  playSequence([
    {
      frequency: 523.25,
      duration: 0.18,
      delay: 0,
      volume: 0.14,
    },
    {
      frequency: 659.25,
      duration: 0.18,
      delay: 0.16,
      volume: 0.15,
    },
    {
      frequency: 783.99,
      duration: 0.18,
      delay: 0.32,
      volume: 0.16,
    },
    {
      frequency: 1046.5,
      duration: 0.25,
      delay: 0.48,
      volume: 0.18,
    },
    {
      frequency: 783.99,
      duration: 0.16,
      delay: 0.72,
      volume: 0.14,
    },
    {
      frequency: 1046.5,
      duration: 0.45,
      delay: 0.88,
      volume: 0.2,
    },
  ]);
}

function playLose() {
  playSequence([
    {
      frequency: 440,
      duration: 0.22,
      delay: 0,
      type: "triangle",
      volume: 0.14,
    },
    {
      frequency: 392,
      duration: 0.22,
      delay: 0.2,
      type: "triangle",
      volume: 0.15,
    },
    {
      frequency: 329.63,
      duration: 0.22,
      delay: 0.4,
      type: "triangle",
      volume: 0.16,
    },
    {
      frequency: 261.63,
      duration: 0.28,
      delay: 0.6,
      type: "triangle",
      volume: 0.17,
    },
    {
      frequency: 196,
      duration: 0.5,
      delay: 0.86,
      type: "triangle",
      volume: 0.18,
    },
  ]);
}

function playShuffle() {
  playSequence([
    {
      frequency: 700,
      duration: 0.07,
      delay: 0,
      type: "triangle",
      volume: 0.08,
    },
    {
      frequency: 540,
      duration: 0.07,
      delay: 0.06,
      type: "triangle",
      volume: 0.09,
    },
    {
      frequency: 760,
      duration: 0.07,
      delay: 0.12,
      type: "triangle",
      volume: 0.08,
    },
    {
      frequency: 500,
      duration: 0.07,
      delay: 0.18,
      type: "triangle",
      volume: 0.09,
    },
    {
      frequency: 680,
      duration: 0.07,
      delay: 0.24,
      type: "triangle",
      volume: 0.08,
    },
    {
      frequency: 460,
      duration: 0.1,
      delay: 0.3,
      type: "triangle",
      volume: 0.1,
    },
  ]);
}

function playAddNumbers() {
  playSequence([
    {
      frequency: 392,
      duration: 0.12,
      delay: 0,
      volume: 0.1,
    },
    {
      frequency: 493.88,
      duration: 0.12,
      delay: 0.1,
      volume: 0.12,
    },
    {
      frequency: 587.33,
      duration: 0.15,
      delay: 0.2,
      volume: 0.14,
    },
    {
      frequency: 783.99,
      duration: 0.25,
      delay: 0.3,
      volume: 0.16,
    },
  ]);
}

function playRevert() {
  playSequence([
    {
      frequency: 659.25,
      duration: 0.12,
      delay: 0,
      volume: 0.12,
    },
    {
      frequency: 554.37,
      duration: 0.12,
      delay: 0.1,
      volume: 0.11,
    },
    {
      frequency: 440,
      duration: 0.18,
      delay: 0.2,
      volume: 0.1,
    },
  ]);
}

function playHint() {
  playSequence([
    {
      frequency: 659.25,
      duration: 0.12,
      delay: 0,
      volume: 0.1,
    },
    {
      frequency: 783.99,
      duration: 0.12,
      delay: 0.1,
      volume: 0.11,
    },
    {
      frequency: 1046.5,
      duration: 0.18,
      delay: 0.2,
      volume: 0.13,
    },
    {
      frequency: 1318.51,
      duration: 0.3,
      delay: 0.34,
      volume: 0.12,
    },
  ]);
}

export {
  playSelect,
  playPairSelect,
  playValidPair,
  playInvalidPair,
  playErase,
  playWin,
  playLose,
  playShuffle,
  playAddNumbers,
  playRevert,
  playHint,
};
