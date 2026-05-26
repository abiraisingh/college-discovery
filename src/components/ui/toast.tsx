'use client';

import { createContext } from 'react';

export type ToastContextValue = {
  notify: (message: string) => void;
  clear: () => void;
};

export const ToastContext = createContext<ToastContextValue>({
  notify: () => undefined,
  clear: () => undefined
});
