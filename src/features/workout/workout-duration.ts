import { useSyncExternalStore } from "react";

let startedAtMs: number | null = null;
let tickVersion = 0;
let tickerId: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => {
    listener();
  });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function stopTicker() {
  if (tickerId == null) {
    return;
  }

  clearInterval(tickerId);
  tickerId = null;
}

function ensureTicker() {
  if (tickerId != null || startedAtMs == null) {
    return;
  }

  tickerId = setInterval(() => {
    tickVersion += 1;
    emit();
  }, 1000);
}

export function formatDurationClock(durationMs: number): string {
  const totalSeconds = Math.max(0, Math.floor(durationMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${mm}:${ss}`;
  }

  return `${mm}:${ss}`;
}

export function getWorkoutElapsedMs(): number {
  if (startedAtMs == null) {
    return 0;
  }

  return Math.max(0, Date.now() - startedAtMs);
}

export function isWorkoutDurationRunning(): boolean {
  return startedAtMs != null;
}

export function startWorkoutDuration(): void {
  if (startedAtMs != null) {
    return;
  }

  startedAtMs = Date.now();
  tickVersion += 1;
  ensureTicker();
  emit();
}

export function ensureWorkoutDurationStarted(): void {
  startWorkoutDuration();
}

export function clearWorkoutDuration(): void {
  if (startedAtMs == null && tickerId == null) {
    return;
  }

  startedAtMs = null;
  stopTicker();
  tickVersion += 1;
  emit();
}

function getElapsedLabelSnapshot(): string {
  void tickVersion;
  return formatDurationClock(getWorkoutElapsedMs());
}

export function useWorkoutElapsedLabel(): string {
  return useSyncExternalStore(
    subscribe,
    getElapsedLabelSnapshot,
    getElapsedLabelSnapshot,
  );
}
