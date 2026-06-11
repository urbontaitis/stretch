import { describe, it, expect } from 'vitest';
import { exercises, buildRoutine, STRETCH_SECONDS } from './exercises.js';

describe('exercise data', () => {
  it('holds each stretch for 30 seconds', () => {
    expect(STRETCH_SECONDS).toBe(30);
  });

  it('every exercise has a name, description and figure', () => {
    for (const ex of exercises) {
      expect(ex.name).toBeTruthy();
      expect(ex.description).toBeTruthy();
      expect(ex.figure).toBeTruthy();
      expect(typeof ex.perLeg).toBe('boolean');
    }
  });
});

describe('buildRoutine', () => {
  it('expands per-leg exercises into left then right steps', () => {
    const routine = buildRoutine([
      { id: 1, name: 'A', perLeg: true },
      { id: 2, name: 'B', perLeg: false }
    ]);
    expect(routine.map((s) => s.leg)).toEqual(['left', 'right', null]);
    expect(routine.map((s) => s.key)).toEqual(['1-left', '1-right', '2']);
  });

  it('keeps left and right of the same exercise adjacent', () => {
    const routine = buildRoutine();
    for (let i = 0; i < routine.length; i++) {
      if (routine[i].leg === 'left') {
        expect(routine[i + 1].id).toBe(routine[i].id);
        expect(routine[i + 1].leg).toBe('right');
      }
    }
  });

  it('produces the expected total number of steps', () => {
    const expected = exercises.reduce((n, ex) => n + (ex.perLeg ? 2 : 1), 0);
    expect(buildRoutine()).toHaveLength(expected);
  });
});
