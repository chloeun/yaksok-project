'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { signOut } from 'next-auth/react';

export default function MainPage() {
  const session = useSelector((state: RootState) => state.session.user);

  if (!session) {
    return <div>Please sign in</div>;
  }

  return (
    <div>
      <h1>Welcome, {session.email}</h1>
      <p>Your name: {session.name}</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
