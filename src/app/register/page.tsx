'use client';

import { supabase } from '@/lib/supabaseClient'; // Supabase 클라이언트 불러오기
import { useState } from 'react'; // useState 훅을 사용하여 상태 관리
import Link from 'next/link'; // Link를 사용하여 페이지 이동
import Navbar from '@/components/Navbar'; // 상단 네비게이션 바 컴포넌트
import { useRouter } from 'next/navigation'; // 페이지 이동을 위한 라우터 훅
import { signIn } from 'next-auth/react'; // NextAuth를 통해 소셜 로그인 기능 구현
import { RiKakaoTalkFill } from 'react-icons/ri'; // 카카오 아이콘

// 회원가입 페이지 컴포넌트 정의
const RegisterPage = () => {
  // 상태 관리: 사용자 입력 값을 저장하는 상태 변수들
  const [username, setUsername] = useState(''); // 아이디 상태
  const [password, setPassword] = useState(''); // 비밀번호 상태
  const [name, setName] = useState(''); // 이름 상태
  const [confirmPassword, setConfirmPassword] = useState(''); // 비밀번호 확인 상태
  const [isUsernameChecked, setIsUsernameChecked] = useState(false); // 아이디 중복 확인 여부
  const [usernameError, setUsernameError] = useState(''); // 아이디 입력 경고 메시지 상태
  const [passwordError, setPasswordError] = useState(''); // 비밀번호 입력 경고 메시지 상태
  const [confirmPasswordError, setConfirmPasswordError] = useState(''); // 비밀번호 확인 경고 메시지 상태
  const router = useRouter(); // 페이지 이동을 위한 useRouter 사용

  // 아이디 유효성 검사 함수
  const validateUsername = (username: string) => {
    const usernameRegex = /^[a-zA-Z0-9]{3,15}$/; // 3~15자의 영문자 또는 숫자만 허용하는 정규식
    return usernameRegex.test(username); // 아이디가 유효한지 여부 반환
  };

  // 비밀번호 유효성 검사 함수
  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/; // 8자 이상의 소문자와 숫자를 포함한 비밀번호를 허용하는 정규식
    return passwordRegex.test(password); // 비밀번호가 유효한지 여부 반환
  };

  // 아이디 중복 확인 함수
  const handleUsernameCheck = async () => {
    if (!validateUsername(username)) {
      setUsernameError('아이디는 3~15자의 영문자 또는 숫자만 가능합니다.'); // 유효하지 않은 아이디일 경우 경고 메시지
      setIsUsernameChecked(false);
      return;
    }

    // Supabase 데이터베이스에서 입력한 아이디가 존재하는지 확인
    const { data: existingUser, error } = await supabase
      .from('users')
      .select('id')
      .eq('username', username) // 아이디가 같은 데이터 찾기
      .single();

    // 이미 사용 중인 아이디일 경우 경고 메시지
    if (existingUser) {
      setUsernameError('이미 사용 중인 아이디입니다.');
      setIsUsernameChecked(false);
    } else if (error && error.code !== 'PGRST116') {
      // 중복 확인 중 오류 발생 시
      setUsernameError('아이디 중복 확인 중 오류가 발생했습니다: ' + error.message);
      setIsUsernameChecked(false);
    } else {
      // 사용 가능한 아이디일 경우
      setUsernameError('사용 가능한 아이디입니다.');
      setIsUsernameChecked(true);
    }
  };

  // 비밀번호 변경 시 호출되는 함수
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    // 비밀번호 유효성 검사
    if (!validatePassword(value)) {
      setPasswordError('비밀번호는 8자 이상이어야 하며, 소문자와 숫자를 포함해야 합니다.'); // 비밀번호가 유효하지 않을 경우 경고 메시지
    } else {
      setPasswordError('');
    }

    // 비밀번호 확인 입력 필드와 일치하는지 검사
    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
    } else if (confirmPassword && value === confirmPassword) {
      setConfirmPasswordError('비밀번호가 일치합니다.');
    } else {
      setConfirmPasswordError('');
    }
  };

  // 비밀번호 확인 필드의 입력 값 변경 시 호출되는 함수
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);

    // 비밀번호와 비밀번호 확인이 일치하는지 검사
    if (password && value !== password) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
    } else if (password && value === password) {
      setConfirmPasswordError('비밀번호가 일치합니다.');
    } else {
      setConfirmPasswordError('');
    }
  };

  // 회원가입 버튼 클릭 시 호출되는 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 폼 제출 기본 동작 방지

    // 아이디 중복 확인 여부 체크
    if (!isUsernameChecked) {
      alert('아이디 중복 확인을 진행해 주세요.');
      return;
    }

    // 비밀번호 유효성 검사
    if (!validatePassword(password)) {
      alert('비밀번호는 8자 이상이어야 하며, 소문자와 숫자를 포함해야 합니다.');
      return;
    }

    // 비밀번호와 비밀번호 확인 일치 여부 체크
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    // Supabase를 사용하여 사용자 정보 삽입
    const { error } = await supabase.from('users').insert([{ username, password, name }]);
    if (error) {
      // 회원가입 중 오류 발생 시 경고 메시지
      alert('회원가입 중 오류가 발생했습니다: ' + error.message);
    } else {
      // 회원가입 성공 시 메시지 표시 후 로그인 페이지로 이동
      alert('회원가입이 성공적으로 완료되었습니다! 로그인 해주세요.');
      router.push('/login');
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-primary pt-24 md:pt-16">
      <Navbar /> {/* 상단 네비게이션 바 */}
      <div className="flex flex-col md:items-center p-6 w-full max-w-md mx-auto md:max-w-2xl">
        <div className="md:text-center p-2 md:p-4">
          <h1 className="text-[22px] md:text-[30px] font-bold text-textButton font-pretendard tracking-[0.35em] mb-2 md:mb-3">회원가입</h1>
          <h1 className="text-[14px] md:text-[16px] font-extrabold text-textButton font-deliusRegular tracking-[0.35em]">SIGN UP</h1>
        </div>
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-5 pt-10 pb-12 rounded-2xl shadow-md md:max-w-2xl mt-4 md:p-10">
          {/* 카카오 로그인 버튼 */}
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

          {/* 아이디 입력 필드와 중복 확인 버튼 */}
          <div className="mb-2 flex items-center space-x-2">
            <input
              className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 focus:outline-none focus:shadow-outline h-12"
              id="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setUsernameError(''); // 입력 중 경고 메시지 초기화
              }}
              placeholder="아이디"
            />
            <button
              type="button"
              onClick={handleUsernameCheck}
              className="bg-[#838380] text-white text-sm md:text-base hover:bg-buttonA hover:text-textButton tracking-[0.10em] whitespace-nowrap px-4 py-2 h-12 rounded-lg focus:outline-none focus:shadow-outline shadow-md transition"
            >
              중복확인
            </button>
          </div>
          {usernameError && (
            <p className={`text-md ml-1 mt-2 ${isUsernameChecked ? 'text-green-500' : 'text-red-500'}`}>
              {usernameError} {/* 아이디 유효성 검사 결과 표시 */}
            </p>
          )}

          {/* 비밀번호 입력 필드 */}
          <div className="mt-7">
            <input
              className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="비밀번호"
            />
            {passwordError && (
              <p className="text-md ml-1 mt-2 text-red-500">
                {passwordError} {/* 비밀번호 유효성 검사 결과 표시 */}
              </p>
            )}
          </div>

          {/* 비밀번호 확인 입력 필드 */}
          <div className="mt-7 mb-10">
            <input
              className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="비밀번호 확인"
            />
            {/* 비밀번호 확인 결과 메시지 */}
            {confirmPasswordError && (
              <p className={`text-md ml-1 mt-2 ${confirmPassword === password ? 'text-green-500' : 'text-red-500'}`}>
                {confirmPasswordError} {/* 비밀번호 일치 여부 표시 */}
              </p>
            )}
          </div>

          {/* 회원가입 버튼 */}
          <div className="flex items-center justify-center mt-10 ">
            <button
              className="bg-[#838380] text-white hover:bg-buttonA hover:text-textButton tracking-[0.30em] w-full text-lg font-semibold py-[10px] px-16 rounded-lg focus:outline-none focus:shadow-outline shadow-lg"
              type="submit"
            >
              회원가입
            </button>
          </div>

          {/* 로그인 페이지로 이동하는 링크 */}
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
