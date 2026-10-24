import { useState, useEffect } from "react";

let isModalActiveState = false;
const listeners = new Set<(active: boolean) => void>();

export function setModalActive(active: boolean): void {
  isModalActiveState = active;
  listeners.forEach((listener) => listener(active));
}

export function useIsModalActive(): boolean {
  const [active, setActive] = useState(isModalActiveState);

  useEffect(() => {
    const listener = (state: boolean) => setActive(state);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return active;
}
