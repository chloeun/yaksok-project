'use client';

import Link from 'next/link'; // 페이지 간 이동을 위한 Link 컴포넌트
import { IoHomeOutline } from 'react-icons/io5'; // 홈 아이콘 (React Icons 사용)
import { FiUser } from 'react-icons/fi'; // 유저 아이콘 (React Icons 사용)
import { MdOutlineLogout } from 'react-icons/md'; // 로그아웃 아이콘 (React Icons 사용)
import { RxHamburgerMenu } from 'react-icons/rx'; // 햄버거 메뉴 아이콘 (React Icons 사용)
import { useState, useEffect, useRef } from 'react'; // 상태 관리 및 DOM 제어를 위한 Hooks
import { signOut } from 'next-auth/react'; // 로그아웃 기능을 위한 NextAuth의 signOut 함수

const Navbar = () => {
  // 아이콘의 기본 색상 설정
  const iconColor = "#737370";

  // 드롭다운 메뉴의 열림 상태를 관리하는 상태 변수
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // 드롭다운 메뉴의 DOM 요소에 접근하기 위한 ref (DOM 요소에 직접 접근할 때 사용)
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 드롭다운 메뉴의 열림 상태를 토글하는 함수
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen); // 드롭다운이 열려있으면 닫고, 닫혀있으면 염
  };

  // 페이지 외부 클릭 시 드롭다운을 닫기 위한 useEffect 훅
  useEffect(() => {
    // 드롭다운 외부를 클릭했을 때 드롭다운을 닫는 함수
    const handleClickOutside = (event: MouseEvent) => {
      // 클릭한 위치가 드롭다운 메뉴 영역 외부인지 확인
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) && 
        !(event.target as HTMLElement).closest('.hamburger-button') // 햄버거 버튼 제외
      ) {
        setDropdownOpen(false); // 드롭다운을 닫음
      }
    };

    // 클릭 이벤트 리스너 등록
    document.addEventListener('mousedown', handleClickOutside);

    // 컴포넌트가 언마운트 될 때, 이벤트 리스너를 제거하여 메모리 누수 방지
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="w-full bg-primary md:bg-white shadow-md p-4 flex justify-between items-center fixed top-10 md:top-0 z-50">
      {/* 네비게이션의 로고 영역 */}
      <div className="flex items-center">
        {/* YAKSOK 타이틀 (로고) */}
        <h1 className="text-md font-bold text-gray-600 font-deliusRegular tracking-[0.35em]">YAKSOK</h1>
      </div>
      
      {/* 네비게이션 메뉴 영역 (Home, Profile, Logout, 햄버거 메뉴) */}
      <div className="space-x-4 flex pr-1">
        {/* Home 링크 버튼 */}
        <Link href="/main" passHref>
          <div className="text-gray-600 cursor-pointer flex items-center space-x-2">
            <IoHomeOutline color={iconColor} size={24} /> {/* 홈 아이콘 */}
            <span className="hidden md:inline font-pretendard">Home</span> {/* Home 텍스트 (작은 화면에서는 숨김) */}
          </div>
        </Link>
        
        {/* Profile 링크 버튼 */}
        <Link href="/profile" passHref>
          <div className="text-gray-600 cursor-pointer flex items-center space-x-2">
            <FiUser color={iconColor} size={24} /> {/* 프로필 아이콘 */}
            <span className="hidden md:inline">Profile</span> {/* Profile 텍스트 (작은 화면에서는 숨김) */}
          </div>
        </Link>

        {/* Logout 버튼 */}
        <button onClick={() => signOut()} className="text-gray-600 cursor-pointer flex items-center space-x-2">
          <MdOutlineLogout color={iconColor} size={24} /> {/* 로그아웃 아이콘 */}
          <span className="hidden md:inline">Logout</span> {/* Logout 텍스트 (작은 화면에서는 숨김) */}
        </button>

        {/* 햄버거 메뉴 버튼 (모바일에서만 보임) */}
        <button className="text-gray-600 hamburger-button relative" onClick={toggleDropdown}>
          <RxHamburgerMenu color={iconColor} size={24} /> {/* 햄버거 메뉴 아이콘 */}
        </button>
      </div>

      {/* 드롭다운 메뉴 (햄버거 메뉴 클릭 시 열림) */}
      <div
        ref={dropdownRef} // 드롭다운 메뉴의 DOM 요소 참조
        className={`absolute right-[10px] mt-[222px] w-36 bg-white shadow-lg rounded-lg py-2 dropdown-menu transition-transform duration-300 ease-in-out transform ${
          dropdownOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'
        } origin-top`} // 드롭다운 애니메이션 효과 (열림/닫힘)
      >
        {/* 드롭다운 메뉴에서 Home 버튼 */}
        <Link href="/" passHref>
          <div className="block px-4 py-3 text-gray-800 cursor-pointer hover:bg-gray-100 rounded-t-lg">Home</div>
        </Link>

        {/* 드롭다운 메뉴에서 Profile 버튼 */}
        <Link href="/profile" passHref>
          <div className="block px-4 py-3 text-gray-800 cursor-pointer hover:bg-gray-100">Profile</div>
        </Link>

        {/* 드롭다운 메뉴에서 Logout 버튼 */}
        <button onClick={() => signOut()} className="block px-4 py-3 text-gray-800 cursor-pointer hover:bg-gray-100 rounded-b-lg">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
