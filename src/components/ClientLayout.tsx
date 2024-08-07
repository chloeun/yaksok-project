'use client';

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { signOut } from 'next-auth/react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import AuthSession from '@/app/_component/AuthSession';

type ClientLayoutProps = {
  children: ReactNode;
  session: any;
};

export default function ClientLayout({ children, session }: ClientLayoutProps) {
  const pathname = usePathname();
  const clientSession = useSelector((state: RootState) => state.session.user);

  return (
    <AuthSession session={session}>
      <Suspense fallback={<div>Loading...</div>}>
        <header>
          {clientSession && (
            <nav>
              <span>Welcome, {clientSession.email}</span>
              <button onClick={() => signOut()}>Sign Out</button>
            </nav>
          )}
        </header>
        <main className="flex-1">{children}</main>
      </Suspense>
    </AuthSession>
  );
}
