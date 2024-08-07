import Image from 'next/image';
import Link from 'next/link';
import YaksokLogo from '@/assets/images/YaksokLogo.png';

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary">
      <div className="flex flex-col items-center p-6">
        <Image
          src={YaksokLogo}
          alt="Yaksok Logo"
          width={200}
          height={250}
          className="md:w-[200px] md:h-[250px]" 
        />
        <h1 className="text-2xl md:text-4xl font-bold mt-6 text-gray-800 font-deliusUnicaseBold">Welcome to YAKSOK</h1>
        <p className="text-gray-600 mt-2 md:text-xl font-deliusUnicaseRegular">Make fun plans!</p>
        <Link href="/login">
          <div className="mt-6 px-4 py-2 md:px-6 md:py-3 bg-secondary text-white rounded shadow hover:bg-secondaryHover transition">
            시작하기
          </div>
        </Link>
        <div>
          <p className="font-seoulHangang">This text uses SeoulHangang font.</p>
          <p className="font-deliusUnicaseRegular">This text uses Delius Unicase Regular font.</p>
          <p className="font-deliusUnicaseBold">This text uses Delius Unicase Bold font.</p>
          <p className="font-pretendardVariable">This text uses Pretendard Variable font.</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
