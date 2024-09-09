'use client';

import { useEffect } from 'react';
import { ReactNode } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar'; // Navbar 컴포넌트를 가져옵니다

type ClientLayoutProps = {
  children: ReactNode;
};

export default function ClientLayout({ children }: ClientLayoutProps) {
  const { data: session, status } = useSession(); // 로그인 상태 및 세션 정보 가져오기
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // 세션 상태가 확인될 때까지 대기

    if (status === 'unauthenticated') {
      router.push('/login'); // 로그인되지 않은 상태일 경우 로그인 페이지로 리디렉션
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>; // 로딩 중일 때 로딩 메시지 표시
  }

  return (
    <>
      {session && <Navbar />} {/* 로그인된 사용자에게만 Navbar를 표시 */}
      <main className="flex-1">{children}</main> {/* 로그인된 상태에서의 메인 콘텐츠 */}
    </>
  );
}
