import type { StateStorage } from "zustand/middleware";

/**
 * Persistence abstraction the cart store depends on. `sessionStorage` is
 * used deliberately — the cart survives reloads and in-app navigation
 * within a browser session (per Sprint 7's "persist during browser
 * session" requirement) but clears when the tab/browser closes, rather
 * than lingering indefinitely like `localStorage`.
 *
 * This implements Zustand's `StateStorage` interface. Sprint 9 replaces
 * this file's internals — e.g. reading/writing an authenticated user's
 * cart via the backend API — without the store (`cartStore.ts`) or any
 * component needing to change.
 */
export const cartSessionStorage: StateStorage = {
  getItem: (name) => {
    if (typeof window === "undefined") return null;
    return window.sessionStorage.getItem(name);
  },
  setItem: (name, value) => {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(name, value);
  },
  removeItem: (name) => {
    if (typeof window === "undefined") return;
    window.sessionStorage.removeItem(name);
  },
};
