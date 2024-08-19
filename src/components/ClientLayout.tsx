'use client';

import { useEffect } from 'react'; // React의 useEffect 훅을 사용
import { ReactNode } from 'react'; // ReactNode 타입을 가져옴
import { signOut, useSession } from 'next-auth/react'; // next-auth의 signOut과 useSession 훅을 가져옴
import { useSelector, useDispatch } from 'react-redux'; // Redux의 useSelector와 useDispatch 훅을 가져옴
import { RootState } from '@/stores/store'; // Redux 스토어의 상태 타입을 가져옴
import { setSession, clearSession } from '@/stores/slice/sessionSlice'; // sessionSlice에서 정의된 액션을 가져옴

type ClientLayoutProps = {
  children: ReactNode; // children prop의 타입을 ReactNode로 정의
};

export default function ClientLayout({ children }: ClientLayoutProps) {
  const dispatch = useDispatch(); // Redux store에 액션을 전달하기 위한 dispatch 함수
  const { data: session, status } = useSession(); // 현재 세션 정보를 가져옴 (NextAuth의 useSession 훅 사용)
  const clientSession = useSelector((state: RootState) => state.session.user); // Redux store에서 session 정보를 가져옴

  // 세션 데이터를 Redux store에 동기화
  useEffect(() => {
    if (session && session.user) {
      dispatch(setSession(session.user)); // 세션이 존재하면 Redux store에 세션 데이터를 저장
    } else if (!session) {
      dispatch(clearSession()); // 세션이 없으면 Redux store에서 세션 데이터를 지움
    }
  }, [session, dispatch]);

  // 세션이 로딩 중일 때 로딩 메시지를 표시
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  // 사용자가 인증되지 않은 경우 (로그인되지 않은 경우)
  if (status === 'unauthenticated' && !clientSession) {
    // 이 부분에서 로그인 페이지로 리디렉션하는 처리를 할 수 있음
    return <div>Redirecting...</div>;
  }

  // 디버깅용 콘솔 로그
  console.log('Session status:', status);
  console.log('Session data:', session);
  console.log('Redux session:', clientSession);

  return (
    <>
      <header>
        {clientSession && ( // Redux store에 저장된 사용자 정보가 있을 때만 네비게이션 바를 표시
          <nav>
            <span>Welcome, {clientSession.username}</span>
            <button onClick={() => signOut()}>Sign Out</button> {/* 로그아웃 버튼 */}
          </nav>
        )}
      </header>
      <main className="flex-1">{children}</main> {/* 메인 컨텐츠 영역 */}
    </>
  );
}
