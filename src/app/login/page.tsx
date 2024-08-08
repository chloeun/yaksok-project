'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn('credentials', { email, password });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary">
      <form onSubmit={handleSubmit} className="flex flex-col items-center p-6">
        <label className="mb-4 font-delius">
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="ml-2 p-2 border border-gray-300 rounded"
          />
        </label>
        <label className="mb-4 font-devanagari">
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="ml-2 p-2 border border-gray-300 rounded"
          />
        </label>
        <button type="submit" className="mt-4 px-4 py-2 bg-secondary text-white rounded hover:bg-secondaryHover transition">
          Sign In
        </button>
        <button type="button" onClick={() => signIn('google')} className="mt-2 px-4 py-2 font-delius bg-secondary text-white rounded hover:bg-secondaryHover transition">
          Sign In with Google
        </button>
        <button type="button" onClick={() => signIn('kakao')} className="mt-2 px-4 py-2 bg-secondary text-white rounded hover:bg-secondaryHover transition">
          Sign In with Kakao
        </button>
      </form>
    </div>
  );
};

export default SignIn;
