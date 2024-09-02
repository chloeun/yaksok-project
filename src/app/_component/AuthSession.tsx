'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

type AuthSessionProps = {
  children: ReactNode;
  initialSession?: any; // 서버에서 전달된 초기 세션
};

export default function AuthSession({ children }: AuthSessionProps) {
  return (
    <SessionProvider >
      {children}
    </SessionProvider>
  );
}
