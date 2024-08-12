// File path: /app/register/page.tsx
'use client';

import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { RiKakaoTalkFill } from 'react-icons/ri';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const validateUsername = (username: string) => {
    const usernameRegex = /^[a-zA-Z0-9]{3,15}$/;
    return usernameRegex.test(username);
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateUsername(username)) {
      alert('아이디는 3~15자의 영문자 또는 숫자만 가능합니다.');
      return;
    }
    if (!validatePassword(password)) {
      alert('비밀번호는 8자 이상이어야 하며, 소문자와 숫자를 포함해야 합니다.');
      return;
    }
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    const { error } = await supabase.from('users').insert([{ username, password, name }]);
    if (error) {
      alert('회원가입 중 오류가 발생했습니다: ' + error.message);
    } else {
      alert('회원가입이 성공적으로 완료되었습니다! 로그인 해주세요.');
      router.push('/login');
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-primary pt-24 md:pt-16">
      <Navbar />
      <div className="flex flex-col md:items-center p-6 w-full max-w-md mx-auto md:max-w-2xl">
        <div className="md:text-center p-2 md:p-4">
          <h1 className="text-[22px] md:text-[30px] font-bold text-textButton font-pretendard tracking-[0.35em] mb-2 md:mb-3">회원가입</h1>
          <h1 className="text-[14px] md:text-[16px] font-extrabold text-textButton font-deliusRegular tracking-[0.35em]">SIGN UP</h1>
        </div>
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-5 pt-10 pb-12 rounded-2xl shadow-md md:max-w-2xl mt-4 md:p-10">
          <div className="flex flex-col items-center">
            <button onClick={() => signIn('kakao')} className="bg-[#ffe403] hover:bg-yellow-500 tracking-[0.10em] w-full text-lg text-textButton font-semibold py-[10px] px-16 rounded-lg focus:outline-none focus:shadow-outline shadow-lg flex items-center justify-center transition">
              <RiKakaoTalkFill className="mr-4" size={24} /> 카카오로 시작하기
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
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름"
            />
          </div>
          <div className="mb-6">
            <input
              className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
          <div className="mb-10">
            <input
              className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호 확인"
            />
          </div>
          <div className="flex items-center justify-center mt-10 ">
            <button
              className="bg-[#838380] text-white hover:bg-buttonA hover:text-textButton tracking-[0.30em] w-full text-lg font-semibold py-[10px] px-16 rounded-lg focus:outline-none focus:shadow-outline shadow-lg"
              type="submit"
            >
              회원가입
            </button>
          </div>
          <div className="flex justify-center text-gray-600 tracking-[0.08em] mt-4 mb-4 md:mb-2">
            이미 회원이신가요?{' '}
            <Link href="/login" passHref>
              <div className="font-bold cursor-pointer ml-2">로그인</div>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
