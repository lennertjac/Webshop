import type { StateStorage } from 'zustand/middleware';

const noop: StateStorage = { getItem: () => null, setItem: () => undefined, removeItem: () => undefined };

/** localStorage in the browser, no-op during SSR. */
export const getStorage = (): StateStorage => (typeof window === 'undefined' ? noop : window.localStorage);
