'use client';

import { useEffect } from 'react';
import { ReactNode } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/stores/store';
import { setSession, clearSession } from '@/stores/slice/sessionSlice';
import { useRouter } from 'next/navigation';

type ClientLayoutProps = {
  children: ReactNode;
};

export default function ClientLayout({ children }: ClientLayoutProps) {
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const clientSession = useSelector((state: RootState) => state.session.user);
  const router = useRouter();

  console.log('Session status:', status);
  console.log('Session data:', session);
  console.log('Redux session:', clientSession);

  useEffect(() => {
    if (status === 'loading') return; // 세션이 로딩 중일 때 리디렉션 방지

    if (status === 'authenticated' && session?.user) {
      dispatch(setSession(session.user)); // 클라이언트 세션을 Redux에 저장
    } else if (status === 'unauthenticated') {
      router.push('/login'); // 인증되지 않은 경우 로그인 페이지로 리디렉션
    }
  }, [session, status, dispatch, router]);

  if (status === 'loading'&&'unauthenticated') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return (
      <div>
        <header>
          <nav>
            <span>Please log in to continue</span>
            <button onClick={() => router.push('/login')}>Log In</button>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  return (
    <>
      <header>
        {clientSession && (
          <nav>
            <span>Welcome, {clientSession.username}</span>
            <button onClick={() => signOut()}>Sign Out</button>
          </nav>
        )}
      </header>
      <main className="flex-1">{children}</main>
    </>
  );
}
