// File path: /app/login/page.tsx

'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { RiKakaoTalkFill } from 'react-icons/ri';

const SignIn = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn('credentials', { id, password, redirect: false });

    if (result?.ok) {
      router.push('/main');
    } else {
      alert('Login failed. Please check your ID and password.');
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-primary pt-24 md:pt-16">
      <Navbar />
      <div className="flex flex-col md:items-center p-6 w-full max-w-md mx-auto md:max-w-2xl">
        <div className="md:text-center p-2 md:p-4">
          <h1 className="text-[22px] md:text-[30px] font-bold text-textButton font-pretendard tracking-[0.35em] mb-2 md:mb-3">로그인</h1>
          <h1 className="text-[14px] md:text-[16px] font-extrabold text-textButton font-deliusRegular tracking-[0.35em]">LOGIN</h1>
        </div>
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-5 pt-10 pb-12 rounded-2xl shadow-md md:max-w-2xl mt-4 md:p-10">
          <div className="flex flex-col items-center mb-6">
            <button onClick={() => signIn('kakao')} className="bg-[#ffe403] hover:bg-yellow-500 tracking-[0.10em] w-full text-lg text-textButton font-semibold py-[10px] px-16 rounded-lg focus:outline-none focus:shadow-outline shadow-lg flex items-center justify-center transition">
              <RiKakaoTalkFill className="mr-4" size={24} /> 카카오 로그인
            </button>
          </div>
          <div className="flex items-center justify-center my-10">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-2 text-gray-600">또는</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <div className="mb-6 mt-2">
            <input
              className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              id="id"
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="아이디"
            />
          </div>
          <div className="mb-6">
            <input
              className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
            />
          </div>
          <div className="flex items-center justify-center mt-10 ">
            <button
              className="bg-[#838380] text-white hover:bg-buttonA hover:text-textButton tracking-[0.30em] w-full text-lg font-semibold py-[10px] px-16 rounded-lg focus:outline-none focus:shadow-outline shadow-lg"
              type="submit"
            >
              로그인
            </button>
          </div>
          <div className="flex justify-center text-gray-600 tracking-[0.08em] mt-4 mb-4 md:mb-2">
            계정이 없으신가요?{' '}
            <Link href="/register" passHref>
              <div className="font-bold cursor-pointer ml-2">회원가입</div>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
