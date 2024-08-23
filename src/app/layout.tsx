import { getServerSession } from 'next-auth'; // 서버 측에서 세션 정보를 가져오기 위한 함수
import { authOptions } from './api/auth/[...nextauth]/route'; // NextAuth의 설정 파일
import { ReactNode } from 'react'; // ReactNode 타입을 가져옴
import ClientLayout from '@/components/ClientLayout'; // ClientLayout 컴포넌트를 가져옴
import ReduxProvider from '@/components/ReduxProvider'; // Redux를 애플리케이션에 제공하기 위한 컴포넌트
import AuthSession from '@/app/_component/AuthSession'; // NextAuth의 세션을 제공하는 컴포넌트
import './globals.css'; // 전역 CSS 파일

// RootLayout 컴포넌트의 props 타입 정의
type RootLayoutProps = {
  children: ReactNode; // children prop의 타입을 ReactNode로 정의
};

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await getServerSession(authOptions); // 서버에서 세션 정보를 가져옴

  return (
    <html lang="ko">
      <body className="flex flex-col min-h-screen">
        <ReduxProvider> {/* Redux 상태 관리를 애플리케이션에 제공 */}
          <AuthSession initialSession={session}> {/* 세션 정보를 모든 하위 컴포넌트에 제공 */}
            <ClientLayout>{children}</ClientLayout> {/* ClientLayout에 children을 전달 */}
          </AuthSession>
        </ReduxProvider>
      </body>
    </html>
  );
}
