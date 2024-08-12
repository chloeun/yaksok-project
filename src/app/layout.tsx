import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import { ReactNode } from 'react';
import ClientLayout from '@/components/ClientLayout';
import localFont from 'next/font/local';
import ReduxProvider from '@/components/ReduxProvider';
import './globals.css';

const seoulHangang = localFont({
  src: '../assets/fonts/SeoulHangang.ttf',
  display: 'swap',
  variable: '--font-seoulHangang',
});

const deliusUnicaseRegular = localFont({
  src: '../assets/fonts/DeliusUnicase-Regular.ttf',
  display: 'swap',
  variable: '--font-deliusUnicaseRegular',
});

const deliusUnicaseBold = localFont({
  src: '../assets/fonts/DeliusUnicase-Bold.ttf',
  display: 'swap',
  variable: '--font-deliusUnicaseBold',
});

const pretendardVariable = localFont({
  src: '../assets/fonts/PretendardVariable.woff2',
  display: 'swap',
  variable: '--font-pretendardVariable',
});



type RootLayoutProps = {
  children: ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="ko" className={`h-full ${seoulHangang.variable} ${deliusUnicaseRegular.variable} ${deliusUnicaseBold.variable} ${pretendardVariable.variable}`}>
      <body className="flex flex-col min-h-screen">
        <ReduxProvider>
          <ClientLayout session={session}>{children}</ClientLayout>
        </ReduxProvider>
      </body>
    </html>
  );
}
