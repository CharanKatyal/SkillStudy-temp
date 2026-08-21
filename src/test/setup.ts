import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn()
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false
  })
});

// Mock URL.createObjectURL and revokeObjectURL
if (typeof window.URL.createObjectURL === 'undefined') {
  window.URL.createObjectURL = () => 'blob:mock-url';
  window.URL.revokeObjectURL = () => {};
}

// Mock localStorage
const mockStorage: Record<string, any> = {};
if (typeof window.localStorage === 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: (key: string) => mockStorage[key] || null,
      setItem: (key: string, val: string) => { mockStorage[key] = val; },
      removeItem: (key: string) => { delete mockStorage[key]; },
      clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
    }
  });
}
