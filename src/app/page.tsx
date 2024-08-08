import Image from 'next/image';
import Link from 'next/link';
import YaksokLogo from '@/assets/images/YaksokLogo.png';

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary">
      <div className="flex flex-col items-center p-6">
        <div className="flex w-[190px] h-[270px] md:w-[190px] md:h-[270px] my-5 md:my-10">
          <Image
            src={YaksokLogo}
            alt="Yaksok Logo"
            layout="responsive"
            width={200}
            height={250}
            className="md:w-[190px] md:h-[270px]"
          />
        </div>
        <div className="text-center mt-8 p-2 md:p-4 leading-tight">
          <h1 className="text-[18px] md:text-[30px] font-bold text-textMain font-deliusUnicaseRegular tracking-[0.35em] mb-4 md:mb-6">Welcome To</h1>
          <h1 className="text-[30px] md:text-[50px] font-extrabold text-textButton font-deliusUnicaseRegular tracking-[0.35em]">YAKSOK</h1>
        </div>
        <p className="text-gray-600 mt-2 md:mt-4 p-2 md:p-4 text-[16px] md:text-xl font-pretendardVariable text-center tracking-[0.32em]">Make fun plans!</p>
        <Link href="/register">
          <div className="mt-14 px-10 md:px-10 py-3  md:py-3 text-[16px] md:text-[28px] bg-buttonA font-bold text-textButton rounded-lg shadow-lg hover:bg-secondaryHover transition text-center tracking-[0.30em]">
            시작하기
          </div>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
