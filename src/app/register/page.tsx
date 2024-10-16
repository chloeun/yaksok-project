'use client';

import { supabase } from '@/lib/supabaseClient'; // Supabase 클라이언트 불러오기
import { useState } from 'react'; // 상태 관리를 위한 useState 사용
import Link from 'next/link'; // 페이지 이동을 위한 Link 컴포넌트
import Navbar from '@/components/Navbar'; // 상단 네비게이션 바 컴포넌트
import { useRouter } from 'next/navigation'; // 페이지 이동을 위한 useRouter 사용
import { signIn } from 'next-auth/react'; // 소셜 로그인을 위한 NextAuth의 signIn 함수
import { RiKakaoTalkFill } from 'react-icons/ri'; // 카카오 로그인 아이콘

// 회원가입 페이지 컴포넌트 정의
const RegisterPage = () => {
  // 상태 변수 정의
  const [username, setUsername] = useState(''); // 아이디 상태
  const [password, setPassword] = useState(''); // 비밀번호 상태
  const [name, setName] = useState(''); // 이름 상태
  const [confirmPassword, setConfirmPassword] = useState(''); // 비밀번호 확인 상태
  const [isUsernameChecked, setIsUsernameChecked] = useState(false); // 아이디 중복 확인 여부
  const [usernameError, setUsernameError] = useState(''); // 아이디 오류 메시지 상태
  const [passwordError, setPasswordError] = useState(''); // 비밀번호 오류 메시지 상태
  const [confirmPasswordError, setConfirmPasswordError] = useState(''); // 비밀번호 확인 오류 메시지 상태
  const router = useRouter(); // 페이지 이동을 위한 라우터

  // 아이디 유효성 검사 함수
  const validateUsername = (username: string) => {
    const usernameRegex = /^[a-zA-Z0-9]{3,15}$/; // 3~15자의 영문자 또는 숫자만 허용하는 정규식
    return usernameRegex.test(username.trim()); // 아이디가 유효한지 여부 반환
  };

  // 비밀번호 유효성 검사 함수
  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/; // 소문자와 숫자를 포함한 8자 이상의 비밀번호 허용
    return passwordRegex.test(password.trim()); // 비밀번호가 유효한지 여부 반환
  };

  // 아이디 중복 확인 함수
  const handleUsernameCheck = async () => {
    const trimmedUsername = username.trim(); // 입력된 아이디에서 공백 제거
    if (!validateUsername(trimmedUsername)) { // 아이디 유효성 검사
      setUsernameError('아이디는 3~15자의 영문자 또는 숫자만 가능합니다.'); // 유효하지 않으면 오류 메시지 설정
      setIsUsernameChecked(false);
      return;
    }

    // Supabase 데이터베이스에서 해당 아이디가 존재하는지 확인
    const { data: existingUser, error } = await supabase
      .from('users')
      .select('id')
      .eq('username', trimmedUsername) // 아이디가 일치하는지 확인
      .single();

    // 이미 존재하는 아이디일 경우
    if (existingUser) {
      setUsernameError('이미 사용 중인 아이디입니다.');
      setIsUsernameChecked(false);
    } else if (error && error.code !== 'PGRST116') { 
      // 오류가 발생했을 경우
      setUsernameError('아이디 중복 확인 중 오류가 발생했습니다: ' + error.message);
      setIsUsernameChecked(false);
    } else {
      // 중복되지 않은 아이디일 경우
      setUsernameError('사용 가능한 아이디입니다.');
      setIsUsernameChecked(true);
    }
  };

  // 아이디 입력 시 공백을 허용하지 않는 함수
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value; // 입력된 값 가져오기
    if (value.includes(' ')) { // 공백이 포함되어 있는지 확인
      setUsernameError('아이디에 공백을 포함할 수 없습니다.'); // 공백 포함 시 오류 메시지 설정
    } else {
      setUsernameError(''); // 오류가 없으면 오류 메시지 제거
      setUsername(value); // 아이디 상태 업데이트
    }
  };

  // 비밀번호 입력 시 공백을 허용하지 않는 함수
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value; // 입력된 값 가져오기
    if (value.includes(' ')) { // 공백이 포함되어 있는지 확인
      setPasswordError('비밀번호에 공백을 포함할 수 없습니다.'); // 공백 포함 시 오류 메시지 설정
    } else {
      setPassword(value); // 비밀번호 상태 업데이트
      if (!validatePassword(value)) { // 비밀번호 유효성 검사
        setPasswordError('비밀번호는 8자 이상이어야 하며, 소문자와 숫자를 포함해야 합니다.'); // 유효하지 않은 비밀번호일 경우
      } else {
        setPasswordError(''); // 유효한 비밀번호일 경우 오류 메시지 제거
      }
    }

    // 비밀번호와 비밀번호 확인 일치 여부 검사
    if (confirmPassword && value !== confirmPassword.trim()) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
    } else if (confirmPassword && value === confirmPassword.trim()) {
      setConfirmPasswordError('비밀번호가 일치합니다.');
    } else {
      setConfirmPasswordError('');
    }
  };

  // 비밀번호 확인 입력 시 공백을 허용하지 않는 함수
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value; // 입력된 값 가져오기
    if (value.includes(' ')) { // 공백이 포함되어 있는지 확인
      setConfirmPasswordError('비밀번호 확인에 공백을 포함할 수 없습니다.'); // 공백 포함 시 오류 메시지 설정
    } else {
      setConfirmPassword(value); // 비밀번호 확인 상태 업데이트
      if (password && value !== password.trim()) { // 비밀번호와 일치 여부 검사
        setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
      } else if (password && value === password.trim()) {
        setConfirmPasswordError('비밀번호가 일치합니다.');
      } else {
        setConfirmPasswordError('');
      }
    }
  };

  // 회원가입 버튼 클릭 시 호출되는 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지

    const trimmedUsername = username.trim(); // 입력된 아이디의 공백 제거
    const trimmedPassword = password.trim(); // 입력된 비밀번호의 공백 제거
    const trimmedConfirmPassword = confirmPassword.trim(); // 비밀번호 확인 공백 제거

    if (!isUsernameChecked) { // 아이디 중복 확인 여부 체크
      alert('아이디 중복 확인을 진행해 주세요.');
      return;
    }

    if (!validatePassword(trimmedPassword)) { // 비밀번호 유효성 검사
      alert('비밀번호는 8자 이상이어야 하며, 소문자와 숫자를 포함해야 합니다.');
      return;
    }

    if (trimmedPassword !== trimmedConfirmPassword) { // 비밀번호와 비밀번호 확인 일치 여부 검사
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    // Supabase를 사용하여 사용자 정보 데이터베이스에 삽입
    const { error } = await supabase.from('users').insert([{ username: trimmedUsername, password: trimmedPassword, name }]);
    if (error) {
      alert('회원가입 중 오류가 발생했습니다: ' + error.message);
    } else {
      alert('회원가입이 성공적으로 완료되었습니다! 로그인 해주세요.');
      router.push('/login'); // 성공 시 로그인 페이지로 이동
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-primary pt-24 md:pt-16">
      {/* <Navbar /> 상단 네비게이션 바 */}
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
              onChange={handleUsernameChange}
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
              {usernameError}
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
                {passwordError}
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
            {confirmPasswordError && (
              <p className={`text-md ml-1 mt-2 ${confirmPassword === password ? 'text-green-500' : 'text-red-500'}`}>
                {confirmPasswordError}
              </p>
            )}
          </div>

          {/* 회원가입 버튼 */}
          <div className="flex items-center justify-center mt-10">
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
