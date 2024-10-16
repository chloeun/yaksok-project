'use client';

import { signIn } from 'next-auth/react'; // NextAuth의 소셜 로그인 함수
import { useState, useEffect } from 'react'; // 상태 관리를 위한 useState 및 useEffect 사용
import { useRouter } from 'next/navigation'; // 페이지 이동을 위한 useRouter 사용
import Link from 'next/link'; // 페이지 이동을 위한 Link 컴포넌트
import Navbar from '@/components/Navbar'; // 상단 네비게이션 바 컴포넌트
import { RiKakaoTalkFill } from 'react-icons/ri'; // 카카오 로그인 아이콘

// 로그인 페이지 컴포넌트 정의
const SignIn = () => {
  const [id, setId] = useState(''); // 아이디 상태
  const [password, setPassword] = useState(''); // 비밀번호 상태
  const [rememberMe, setRememberMe] = useState(false); // "아이디 기억하기" 상태
  const [idError, setIdError] = useState(''); // 아이디 오류 메시지 상태
  const [passwordError, setPasswordError] = useState(''); // 비밀번호 오류 메시지 상태
  const router = useRouter(); // 페이지 이동을 위한 라우터

  // 컴포넌트 마운트 시, 저장된 아이디 불러오기
  useEffect(() => {
    const storedId = localStorage.getItem('rememberedId');
    if (storedId) {
      setId(storedId); // 로컬 스토리지에 저장된 아이디가 있을 경우 설정
      setRememberMe(true); // "아이디 기억하기" 체크
    }
  }, []);

  // 폼 제출 시 호출되는 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지

    // 아이디와 비밀번호 공백 제거
    const trimmedId = id.trim();
    const trimmedPassword = password.trim();

    // "아이디 기억하기"가 체크된 경우 로컬 스토리지에 아이디 저장, 아니면 제거
    if (rememberMe) {
      localStorage.setItem('rememberedId', trimmedId); // 아이디 저장
    } else {
      localStorage.removeItem('rememberedId'); // 아이디 제거
    }

    // NextAuth를 사용하여 로그인 처리
    const result = await signIn('credentials', { id: trimmedId, password: trimmedPassword, redirect: false });

    if (result?.ok) {
      router.push('/main'); // 로그인 성공 시 메인 페이지로 이동
    } else {
      alert('로그인에 실패했습니다. 아이디와 비밀번호를 확인해 주세요.'); // 실패 시 오류 메시지 표시
    }
  };

  // 아이디 입력 시 공백을 허용하지 않는 함수
  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value; // 입력된 값 가져오기
    if (value.includes(' ')) { // 공백이 포함되어 있는지 확인
      setIdError('아이디에 공백을 포함할 수 없습니다.'); // 공백 포함 시 오류 메시지 설정
    } else {
      setIdError(''); // 오류 메시지 제거
      setId(value); // 아이디 상태 업데이트
    }
  };

  // 비밀번호 입력 시 공백을 허용하지 않는 함수
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value; // 입력된 값 가져오기
    if (value.includes(' ')) { // 공백이 포함되어 있는지 확인
      setPasswordError('비밀번호에 공백을 포함할 수 없습니다.'); // 공백 포함 시 오류 메시지 설정
    } else {
      setPasswordError(''); // 오류 메시지 제거
      setPassword(value); // 비밀번호 상태 업데이트
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-primary pt-24 md:pt-16">
      {/* <Navbar /> 상단 네비게이션 바 */}
      <div className="flex flex-col md:items-center p-6 w-full max-w-md mx-auto md:max-w-2xl">
        <div className="md:text-center p-2 md:p-4">
          <h1 className="text-[22px] md:text-[30px] font-bold text-textButton font-pretendard tracking-[0.35em] mb-2 md:mb-3">로그인</h1>
          <h1 className="text-[14px] md:text-[16px] font-extrabold text-textButton font-deliusRegular tracking-[0.35em]">LOGIN</h1>
        </div>
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-5 pt-10 pb-12 rounded-2xl shadow-md md:max-w-2xl mt-4 md:p-10">
          <div className="flex flex-col items-center mb-6">
            <button
              type="button"
              onClick={() => signIn('kakao')}
              className="bg-[#ffe403] hover:bg-yellow-500 tracking-[0.10em] w-full text-lg text-textButton font-semibold py-[10px] px-16 rounded-lg focus:outline-none focus:shadow-outline shadow-lg flex items-center justify-center transition"
            >
              <RiKakaoTalkFill className="mr-4" size={24} /> 카카오 로그인
            </button>
          </div>
          <div className="flex items-center justify-center my-10">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-2 text-gray-600">또는</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* 아이디 입력 필드 */}
          <div className="mb-6 mt-2">
            <input
              className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              id="id"
              type="text"
              value={id}
              onChange={handleIdChange}
              placeholder="아이디"
            />
            {/* {idError && <p className="text-red-500 text-md mt-2">{idError}</p>} 아이디 오류 메시지 */}
          </div>

          {/* 비밀번호 입력 필드 */}
          <div className="mb-6">
            <input
              className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="비밀번호"
            />
            {/* {passwordError && <p className="text-red-500 text-md mt-2">{passwordError}</p>} 비밀번호 오류 메시지 */}
          </div>

          {/* "아이디 기억하기" 체크박스 */}
          <div className="flex items-center mb-6">
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="rememberMe" className="text-gray-600">아이디 기억하기</label>
          </div>

          {/* 로그인 버튼 */}
          <div className="flex items-center justify-center mt-10">
            <button
              type="submit"
              className="bg-[#838380] text-white hover:bg-buttonA hover:text-textButton tracking-[0.30em] w-full text-lg font-semibold py-[10px] px-16 rounded-lg focus:outline-none focus:shadow-outline shadow-lg"
            >
              로그인
            </button>
          </div>

          {/* 회원가입 링크 */}
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
