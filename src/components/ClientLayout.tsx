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
  const router = useRouter(); // Router 객체 추가


  console.log('Session status:', status);
  console.log('Session data:', session);
  console.log('Redux session:', clientSession);
  
  // 세션 데이터를 Redux store에 동기화
  useEffect(() => {
    if (session && session.user) {
      dispatch(setSession(session.user));
    } else if (status === 'unauthenticated') {
      dispatch(clearSession());
      router.push('/login'); // 인증되지 않은 경우 로그인 페이지로 리디렉트
    }
  }, [session, status, dispatch, router]);

  // 세션이 로딩 중일 때 로딩 메시지를 표시
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  // 사용자가 인증되지 않은 경우 기본 레이아웃을 제공
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


  // 인증된 사용자를 위한 레이아웃
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
