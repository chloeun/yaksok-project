'use client';

import { useSession, signOut } from 'next-auth/react';

const MainPage = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please sign in</div>;
  }

  return (
    <div>
      <h1>Welcome, {session.user?.email}</h1>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
};

export default MainPage;
