// Completion chime via the Web Audio API — no audio files needed, so it
// works fully offline. iOS requires the AudioContext to be created/resumed
// inside a user gesture, so unlockAudio() is called from the start button.
let ctx = null;

export function unlockAudio() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  // iOS mutes Web Audio while the ringer switch is on silent unless the
  // session is declared as playback audio (supported from iOS 16.4).
  if (navigator.audioSession) {
    try {
      navigator.audioSession.type = 'playback';
    } catch {
      /* ignore */
    }
  }
  if (!ctx) ctx = new AC();
  if (ctx.state !== 'running') ctx.resume().catch(() => {});
}

function chime() {
  const now = ctx.currentTime;
  [880, 1320].forEach((freq, i) => {
    const t = now + i * 0.18;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.4, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.55);
  });
}

export function playComplete() {
  if (navigator.vibrate) navigator.vibrate(200);
  if (!ctx) return;
  // The context unlocked at the start tap can be suspended again by the
  // time the timer fires (iOS suspends it when the screen locks, the app is
  // backgrounded, or another app interrupts audio — Safari also uses a
  // non-standard 'interrupted' state). Tones scheduled on a suspended
  // context never sound, so resume it first.
  if (ctx.state !== 'running') {
    ctx.resume().then(chime).catch(() => {});
  } else {
    chime();
  }
}
