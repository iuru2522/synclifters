import { useSyncExternalStore } from "react";

type CreateSelectionStoreOptions<T> = {
  initialValue: T;
  prepare?: (value: T) => T;
};

export function createSelectionStore<T>(options: CreateSelectionStoreOptions<T>) {
  let value = options.initialValue;
  const listeners = new Set<() => void>();

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  const get = () => value;

  const set = (next: T) => {
    value = options.prepare ? options.prepare(next) : next;
    listeners.forEach((listener) => {
      listener();
    });
  };

  const useStore = () => useSyncExternalStore(subscribe, get, get);

  return { get, set, subscribe, useStore };
}
