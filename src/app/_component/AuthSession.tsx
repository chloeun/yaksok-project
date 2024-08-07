'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

type AuthSessionProps = {
  children: ReactNode;
  session: any;
};

export default function AuthSession({ children, session }: AuthSessionProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
