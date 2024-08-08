import Link from 'next/link';
import Navbar from '@/components/Navbar';

const RegisterPage = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-primary pt-24 md:pt-16">
      <Navbar />
      <div className="flex flex-col md:items-center p-6 w-full max-w-md mx-auto md:max-w-2xl">
        <div className="md:text-center p-2 md:p-4">
          <h1 className="text-[22px] md:text-[30px] font-bold text-textMain font-pretendard tracking-[0.35em] mb-2 md:mb-3">회원가입</h1>
          <h1 className="text-[14px] md:text-[16px] font-extrabold text-textButton font-deliusRegular tracking-[0.35em]">SIGN UP</h1>
        </div>
        <form className="w-full max-w-md bg-white p-5 rounded-2xl shadow-md md:max-w-2xl mt-4 md:p-10">
          <div className="mb-6 mt-2">
            <label className="block text-gray-700 text-md font-pretendard font-semibold tracking-[0.20em] mb-3 ml-1" htmlFor="name">
              이름:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="홍길동"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-md font-pretendard font-semibold tracking-[0.20em] mb-2 ml-1" htmlFor="email">
              이메일:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="이메일"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-md font-pretendard font-semibold tracking-[0.20em] mb-2 ml-1" htmlFor="password">
              비밀번호:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="비밀번호"
            />
          </div>
          <div className="mb-10">
            <label className="block text-gray-700 text-md font-pretendard font-semibold tracking-[0.18em] mb-2 ml-1" htmlFor="confirm-password">
              비밀번호 확인:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              id="confirm-password"
              type="password"
              placeholder="비밀번호 확인"
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-buttonA hover:bg-secondaryHover tracking-[0.30em] text-lg text-textButton font-bold py-[10px] px-16 rounded-lg focus:outline-none focus:shadow-outline shadow-lg"
              type="button"
            >
              회원가입
            </button>
          </div>
          <div className="flex justify-center text-gray-600 mt-3 tracking-[0.08em] mb-10 md:mb-2">
            이미 회원이신가요?{' '}
            <Link href="/login" passHref>
              <div className=" font-bold cursor-pointer ml-2">로그인</div>
            </Link>
          </div>
        </form>
        
      </div>
    </div>
  );
};

export default RegisterPage;
