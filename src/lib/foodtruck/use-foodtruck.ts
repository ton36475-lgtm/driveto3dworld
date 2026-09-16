import { useEffect, useRef, useState } from "react";
import {
  emptyFoodtruck,
  exportFoodtruck,
  FOODTRUCK_KEY,
  parseFoodtruck,
  type FoodtruckProfile,
} from "./model";

export function useFoodtruck() {
  const [profile, setProfile] = useState(emptyFoodtruck);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<"load" | "save" | "conflict" | null>(null);
  const raw = useRef<string | null>(null);
  useEffect(() => {
    try {
      raw.current = localStorage.getItem(FOODTRUCK_KEY);
      if (raw.current) setProfile(parseFoodtruck(raw.current));
    } catch {
      setError("load");
    }
    setReady(true);
    const changed = (event: StorageEvent) => {
      if ((event.key === FOODTRUCK_KEY || event.key === null) && event.newValue !== raw.current)
        setError("conflict");
    };
    window.addEventListener("storage", changed);
    return () => window.removeEventListener("storage", changed);
  }, []);
  function save(next: FoodtruckProfile, replace = false): boolean {
    if (!ready || (error && !replace)) return false;
    try {
      if (localStorage.getItem(FOODTRUCK_KEY) !== raw.current) {
        setError("conflict");
        return false;
      }
      const updated = { ...next, updatedAt: new Date().toISOString() };
      const value = exportFoodtruck(updated);
      localStorage.setItem(FOODTRUCK_KEY, value);
      raw.current = value;
      setProfile(updated);
      setError(null);
      return true;
    } catch {
      setError("save");
      return false;
    }
  }
  return { profile, ready, error, save };
}
