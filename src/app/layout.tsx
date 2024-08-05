import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import { ReactNode } from 'react';
import ClientLayout from '@/components/ClientLayout';

type RootLayoutProps = {
  children: ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="ko" className="h-full">
      <body className={`flex flex-col min-h-screen`}>
        <ClientLayout session={session}>{children}</ClientLayout>
      </body>
    </html>
  );
}
