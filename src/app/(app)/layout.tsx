'use client';

import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { useAuth } from '@/lib/auth';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { session, ready, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !session) router.replace('/login');
  }, [ready, session, router]);

  if (!ready || !session) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <CircularProgress aria-label="Loading" />
      </div>
    );
  }

  return (
    <>
      <AppHeader userName={session.user.name} onSignOut={signOut} />
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6">{children}</main>
    </>
  );
}
