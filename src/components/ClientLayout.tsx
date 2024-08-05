'use client';

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { signOut } from 'next-auth/react';
import AuthSession from '@/app/_component/AuthSession';

type ClientLayoutProps = {
  children: ReactNode;
  session: any;
};

export default function ClientLayout({ children, session }: ClientLayoutProps) {
  const pathname = usePathname();

  return (
    <AuthSession session={session}>
      <Suspense fallback={<div>Loading...</div>}>
        <header>
          {session && (
            <nav>
              <span>Welcome, {session.user?.email}</span>
              <button onClick={() => signOut()}>Sign Out</button>
            </nav>
          )}
        </header>
        <main className="flex-1">{children}</main>
      </Suspense>
    </AuthSession>
  );
}
