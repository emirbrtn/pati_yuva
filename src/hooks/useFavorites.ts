import { useCallback, useEffect, useSyncExternalStore } from "react";
import { useAuth } from "@/context/AuthContext";

const STORAGE_KEY = "patiyuva-favorites";
const EVT = "patiyuva-favorites-change";

let cachedValue: string | null = null;
let cachedLocal: string[] = [];

function readLocalFavorites(): string[] {
  if (typeof window === "undefined") return cachedLocal;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === cachedValue) return cachedLocal;
    cachedValue = raw;
    if (!raw) {
      cachedLocal = [];
      return cachedLocal;
    }
    const parsed = JSON.parse(raw);
    cachedLocal = Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    cachedLocal = [];
  }
  return cachedLocal;
}

function writeLocalFavorites(ids: string[]) {
  cachedLocal = ids;
  cachedValue = JSON.stringify(ids);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, cachedValue);
    window.dispatchEvent(new Event(EVT));
  }
}

let mode: "guest" | "authed" = "guest";
let serverIds: string[] = [];
const listeners = new Set<() => void>();

function setMode(next: "guest" | "authed") {
  if (mode === next) return;
  mode = next;
  for (const listener of listeners) listener();
}

function setServerIds(ids: string[]) {
  const next = [...ids];
  if (
    next.length === serverIds.length &&
    next.every((id, index) => id === serverIds[index])
  ) {
    return;
  }
  serverIds = next;
  for (const listener of listeners) listener();
}

function getSnapshot(): string[] {
  return mode === "authed" ? serverIds : readLocalFavorites();
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  const sync = () => {
    for (const listener of listeners) listener();
  };
  window.addEventListener(EVT, sync);
  window.addEventListener("storage", sync);
  return () => {
    listeners.delete(callback);
    window.removeEventListener(EVT, sync);
    window.removeEventListener("storage", sync);
  };
}

function getServerSnapshot(): string[] {
  return mode === "authed" ? serverIds : cachedLocal;
}

export function useFavorites() {
  const { user, status } = useAuth();
  const isAuthed = status === "authenticated";

  useEffect(() => {
    if (!isAuthed) {
      setMode("guest");
      return;
    }
    setMode("authed");
    let active = true;
    fetch("/api/me/favorites")
      .then((response) => response.json())
      .then((data: { favoriteIds?: string[] }) => {
        if (active) setServerIds(data.favoriteIds ?? []);
      })
      .catch(() => {
        if (active) setServerIds([]);
      });
    return () => {
      active = false;
    };
  }, [isAuthed, user?.id]);

  const favoriteIds = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const isFavorite = useCallback(
    (id: string) => favoriteIds.includes(id),
    [favoriteIds]
  );

  const toggleFavorite = useCallback(
    async (id: string) => {
      if (isAuthed) {
        const response = await fetch(`/api/me/favorites/${encodeURIComponent(id)}`, {
          method: favoriteIds.includes(id) ? "DELETE" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ animalId: id }),
        });
        if (response.ok) {
          const data = (await response.json()) as { favoriteIds?: string[] };
          if (data.favoriteIds) setServerIds(data.favoriteIds);
        }
        return;
      }
      const current = readLocalFavorites();
      const next = current.includes(id)
        ? current.filter((fid) => fid !== id)
        : [...current, id];
      writeLocalFavorites(next);
    },
    [isAuthed, favoriteIds]
  );

  return { favoriteIds, isFavorite, toggleFavorite };
}