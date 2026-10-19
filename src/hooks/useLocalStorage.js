import { useState, useEffect } from "react";

function readValue(key, initial) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : initial;
    return parsed ?? initial;
  } catch {
    return initial;
  }
}

export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => readValue(key, initial));

  useEffect(() => {
    try {
      const next = JSON.stringify(value);
      if (localStorage.getItem(key) !== next) localStorage.setItem(key, next);
    } catch { /* abaikan */ }
  }, [key, value]);

  // Sinkron antar tab: tab admin langsung melihat booking baru dari tab pelanggan.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== null && e.key !== key) return;
      setValue(readValue(key, initial));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [value, setValue];
}
