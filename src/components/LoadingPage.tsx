'use client';

import Image from 'next/image';
import YaksokLogo from '@/assets/images/YaksokLogo.png'; // Logo path

const LoadingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100"> {/* Flexbox layout for full-screen centering */}
      
      {/* Yaksok Logo */}
      <div className="mb-14"> {/* Bottom margin to push the dots and text lower */}
        <Image
          src={YaksokLogo}
          alt="Yaksok Logo"
          width={180}
          height={180}
          className="object-contain"  
        />
      </div>

      {/* Bouncing dots below the logo */}
      <div className="flex space-x-2 mb-8"> {/* Bottom margin to separate dots from text */}
        <div className="w-4 h-4 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-4 h-4 bg-gray-400 rounded-full animate-bounce delay-100"></div>
        <div className="w-4 h-4 bg-gray-400 rounded-full animate-bounce delay-200"></div>
      </div>

      {/* Loading text below the dots */}
      <p className="text-[22px] md:text-[30px] font-gangwonEdu text-gray-600">
        잠시만 기다려 주세요
      </p>

    </div>
  );
};

export default LoadingPage;
