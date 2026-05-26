'use client';

import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import { ToastContext } from '@/components/ui/toast';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [mounted, setMounted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toast = useMemo(
    () => ({
      notify: (message: string) => setToastMessage(message),
      clear: () => setToastMessage(null)
    }),
    []
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider>
        <ToastContext.Provider value={toast}>
          {children}
          {mounted && toastMessage ? (
            <div className="fixed right-4 bottom-4 z-50 rounded-2xl bg-slate-950 px-4 py-3 text-sm text-white shadow-xl shadow-slate-900/30">
              {toastMessage}
            </div>
          ) : null}
        </ToastContext.Provider>
      </SessionProvider>
    </ThemeProvider>
  );
}
