import { useEffect, useRef, useState } from 'react';
import { buildRoutine, STRETCH_SECONDS } from './exercises.js';
import { Figure } from './figures.jsx';
import { unlockAudio, playComplete } from './sound.js';

const routine = buildRoutine();

const RING_R = 54;
const RING_C = 2 * Math.PI * RING_R;

export default function App() {
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState('idle'); // idle | running | done
  const [remaining, setRemaining] = useState(STRETCH_SECONDS);
  const endAtRef = useRef(0);
  const wakeLockRef = useRef(null);

  useEffect(() => {
    if (phase !== 'running') return;
    const tick = () => {
      const left = Math.max(0, endAtRef.current - Date.now());
      setRemaining(Math.ceil(left / 1000));
      if (left <= 0) {
        setPhase('done');
        playComplete();
      }
    };
    const interval = setInterval(tick, 200);
    return () => clearInterval(interval);
  }, [phase]);

  // Keep the screen on while a stretch timer is running (where supported).
  useEffect(() => {
    if (phase === 'running' && navigator.wakeLock) {
      navigator.wakeLock
        .request('screen')
        .then((lock) => (wakeLockRef.current = lock))
        .catch(() => {});
    }
    return () => {
      wakeLockRef.current?.release().catch(() => {});
      wakeLockRef.current = null;
    };
  }, [phase]);

  const start = () => {
    unlockAudio();
    endAtRef.current = Date.now() + STRETCH_SECONDS * 1000;
    setRemaining(STRETCH_SECONDS);
    setPhase('running');
  };

  const next = () => {
    setStep((s) => s + 1);
    setPhase('idle');
    setRemaining(STRETCH_SECONDS);
  };

  const restart = () => {
    setStep(0);
    setPhase('idle');
    setRemaining(STRETCH_SECONDS);
  };

  if (step >= routine.length) {
    return (
      <main className="app">
        <div className="finished">
          <div className="finished-emoji">🚴</div>
          <h1>All done!</h1>
          <p>Nice ride, nice stretch. See you after the next one.</p>
          <button className="next-btn" onClick={restart}>
            Start over
          </button>
        </div>
      </main>
    );
  }

  const ex = routine[step];
  const progress = phase === 'running' ? remaining / STRETCH_SECONDS : 1;

  return (
    <main className="app">
      <header className="top">
        <span className="counter">
          {step + 1} / {routine.length}
        </span>
        {ex.leg && (
          <span className={`leg leg-${ex.leg}`}>
            {ex.leg === 'left' ? '← LEFT LEG' : 'RIGHT LEG →'}
          </span>
        )}
      </header>

      <section className="exercise">
        <Figure name={ex.figure} mirrored={ex.leg === 'right'} />
        <h1 className="name">{ex.name}</h1>
        <p className="description">{ex.description}</p>
      </section>

      <footer className="controls">
        {phase === 'done' ? (
          <button className="next-btn" onClick={next} autoFocus>
            Next →
          </button>
        ) : (
          <button
            className={`circle-btn ${phase}`}
            onClick={phase === 'idle' ? start : undefined}
            disabled={phase === 'running'}
            aria-label={phase === 'idle' ? 'Start 30 second timer' : 'Timer running'}
          >
            <svg viewBox="0 0 120 120" className="ring">
              <circle className="ring-track" cx="60" cy="60" r={RING_R} />
              <circle
                className="ring-fill"
                cx="60"
                cy="60"
                r={RING_R}
                strokeDasharray={RING_C}
                strokeDashoffset={RING_C * (1 - progress)}
              />
            </svg>
            <span className="circle-content">
              {phase === 'running' ? (
                <span className="seconds">{remaining}</span>
              ) : (
                <svg viewBox="0 0 24 24" className="play" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </span>
          </button>
        )}
        {phase !== 'done' && (
          <button className="skip" onClick={next}>
            skip
          </button>
        )}
      </footer>
    </main>
  );
}
