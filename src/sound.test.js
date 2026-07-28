import { describe, it, expect, beforeEach, vi } from 'vitest';

// Minimal AudioContext stand-in: connect() returns its target so
// osc.connect(gain).connect(destination) chains, and started oscillators
// are recorded so tests can assert whether the chime actually played.
function installFakeAudioContext(initialState) {
  const started = [];
  class FakeAudioContext {
    constructor() {
      this.state = initialState;
      this.currentTime = 0;
      this.destination = {};
      FakeAudioContext.instance = this;
    }
    resume() {
      this.state = 'running';
      return Promise.resolve();
    }
    createOscillator() {
      return {
        type: '',
        frequency: { value: 0 },
        connect: (node) => node,
        start: (t) => started.push(t),
        stop: () => {},
      };
    }
    createGain() {
      return {
        gain: {
          setValueAtTime: () => {},
          exponentialRampToValueAtTime: () => {},
        },
        connect: (node) => node,
      };
    }
  }
  vi.stubGlobal('AudioContext', FakeAudioContext);
  return { started, FakeAudioContext };
}

describe('sound', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
  });

  it('plays two tones when the context is running', async () => {
    const { started } = installFakeAudioContext('running');
    const { unlockAudio, playComplete } = await import('./sound.js');
    unlockAudio();
    playComplete();
    expect(started).toHaveLength(2);
  });

  it('resumes a context that was suspended again before playing', async () => {
    const { started, FakeAudioContext } = installFakeAudioContext('running');
    const { unlockAudio, playComplete } = await import('./sound.js');
    unlockAudio();
    // Simulate iOS suspending the context during the 30 s hold
    // (screen lock, backgrounding, audio interruption).
    FakeAudioContext.instance.state = 'suspended';
    playComplete();
    await Promise.resolve();
    expect(FakeAudioContext.instance.state).toBe('running');
    expect(started).toHaveLength(2);
  });

  it('does nothing without an unlocked context', async () => {
    const { playComplete } = await import('./sound.js');
    expect(() => playComplete()).not.toThrow();
  });
});
