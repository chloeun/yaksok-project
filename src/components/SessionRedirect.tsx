'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const protectedRoutes = [
  '/calendar',
  '/main',
  '/mypage',
  '/result',
  '/choose-location',
  '/coordinate-schedule',
  '/create-schedule',
  '/invited-schedule',
];

export default function SessionRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const path = window.location.pathname;
    if (status === 'unauthenticated' && protectedRoutes.includes(path)) {
      router.push('/login');
    }
  }, [status, router]);

  return null;
}
