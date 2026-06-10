import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import App from './App.jsx';
import { buildRoutine, STRETCH_SECONDS } from './exercises.js';

const routine = buildRoutine();

const startButton = () => screen.getByRole('button', { name: /start 30 second timer/i });
const nextButton = () => screen.getByRole('button', { name: /next/i });

const runTimerOut = () =>
  act(() => {
    vi.advanceTimersByTime(STRETCH_SECONDS * 1000 + 500);
  });

describe('App', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows the first exercise with the left leg indicator', () => {
    render(<App />);
    expect(screen.getByText(routine[0].name)).toBeInTheDocument();
    expect(screen.getByText(/left leg/i)).toBeInTheDocument();
    expect(screen.getByText(`1 / ${routine.length}`)).toBeInTheDocument();
  });

  it('counts down 30 seconds after pressing the circle button', () => {
    render(<App />);
    fireEvent.click(startButton());
    expect(screen.getByText(String(STRETCH_SECONDS))).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(10_000);
    });
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  it('shows Next when the timer completes', () => {
    render(<App />);
    fireEvent.click(startButton());
    runTimerOut();
    expect(nextButton()).toBeInTheDocument();
  });

  it('advances to the other leg of the same exercise', () => {
    render(<App />);
    fireEvent.click(startButton());
    runTimerOut();
    fireEvent.click(nextButton());
    expect(screen.getByText(routine[1].name)).toBeInTheDocument();
    expect(screen.getByText(/right leg/i)).toBeInTheDocument();
    expect(screen.getByText(`2 / ${routine.length}`)).toBeInTheDocument();
  });

  it('finishes the routine after the last exercise', () => {
    render(<App />);
    for (let i = 0; i < routine.length; i++) {
      fireEvent.click(startButton());
      runTimerOut();
      fireEvent.click(nextButton());
    }
    expect(screen.getByText(/all done/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /start over/i }));
    expect(screen.getByText(routine[0].name)).toBeInTheDocument();
  });

  it('skip moves on without running the timer', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /skip/i }));
    expect(screen.getByText(`2 / ${routine.length}`)).toBeInTheDocument();
  });
});
