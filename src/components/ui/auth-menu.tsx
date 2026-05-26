'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export function AuthMenu() {
  const { data: session } = useSession();

  if (!session?.user) {
    return (
      <Link href="/auth/signin">
        <Button variant="default">Sign in</Button>
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/dashboard" className="text-sm text-slate-700 transition hover:text-brand-600 dark:text-slate-200">
        Saved
      </Link>
      <Button variant="outline" onClick={() => signOut()}>
        Sign out
      </Button>
    </div>
  );
}
