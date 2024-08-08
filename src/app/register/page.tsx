import Link from 'next/link';
import Navbar from '@/components/Navbar';

const RegisterPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary">
      <Navbar />
      <div className="flex flex-col items-center p-6 w-full max-w-md mx-auto md:max-w-2xl md:mx-auto">
        <div className="text-center mt-8 p-2 md:p-4 leading-tight">
          <h1 className="text-[18px] md:text-[30px] font-bold text-textMain font-deliusUnicaseRegular tracking-[0.35em] mb-4 md:mb-6">회원 가입</h1>
          <h1 className="text-[18px] md:text-[20px] font-extrabold text-textButton font-deliusUnicaseRegular tracking-[0.35em]">SIGN UP</h1>
        </div>
        <form className="w-full max-w-md bg-white p-6 rounded-lg shadow-md md:max-w-2xl">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              이름:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="이름"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              이메일:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="이메일"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              비밀번호:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="비밀번호"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm-password">
              비밀번호 확인:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="confirm-password"
              type="password"
              placeholder="비밀번호 확인"
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-buttonA hover:bg-secondaryHover text-textButton font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline shadow-lg"
              type="button"
            >
              회원 가입
            </button>
          </div>
        </form>
        <div className="mt-4">
          <div className="text-gray-600 text-center">
            이미 회원이신가요?{' '}
            <Link href="/login" passHref>
              <div className="text-secondaryHover font-bold cursor-pointer">로그인</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
