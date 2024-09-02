'use client';

import { useEffect } from 'react';
import { ReactNode } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type ClientLayoutProps = {
  children: ReactNode;
};

export default function ClientLayout({ children }: ClientLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Wait until session status is known

    if (status === 'unauthenticated') {
      router.push('/login'); // Redirect to login if unauthenticated
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <>
      <header>
        {session?.user && (
          <nav>
            <span>Welcome, {session.user.username}</span>
            <button onClick={() => signOut()}>Sign Out</button>
          </nav>
        )}
      </header>
      <main className="flex-1">{children}</main>
    </>
  );
}
