'use client'
import Link from 'next/link';
import { IoHomeOutline } from 'react-icons/io5';
import { FiUser } from 'react-icons/fi';
import { MdOutlineLogout } from 'react-icons/md';
import { RxHamburgerMenu } from 'react-icons/rx';
import { useState, useEffect, useRef } from 'react';

const Navbar = () => {
  const iconColor = "#737370";
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && !(event.target as HTMLElement).closest('.hamburger-button')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="w-full md:bg-white shadow-md p-4 flex justify-between items-center fixed top-10 md:top-0 z-100">
      <div className="flex items-center">
        <h1 className="text-md font-bold text-gray-600 font-deliusRegular tracking-[0.35em]">YAKSOK</h1>
      </div>
      <div className="space-x-4 flex pr-1">
        <Link href="/" passHref>
          <div className="text-gray-600 cursor-pointer flex items-center space-x-2">
            <IoHomeOutline color={iconColor} size={24} />
            <span className="hidden md:inline font-pretendard">Home</span>
          </div>
        </Link>
        <Link href="/" passHref>
          <div className="text-gray-600 cursor-pointer flex items-center space-x-2">
            <FiUser color={iconColor} size={24} />
            <span className="hidden md:inline text-">Profile</span>
          </div>
        </Link>
        <Link href="/login" passHref>
          <div className="text-gray-600 cursor-pointer flex items-center space-x-2">
            <MdOutlineLogout color={iconColor} size={24} />
            <span className="hidden md:inline">Logout</span>
          </div>
        </Link>
        <button className="text-gray-600 hamburger-button relative" onClick={toggleDropdown}>
          <RxHamburgerMenu color={iconColor} size={24} />
        </button>
      </div>
      <div
        ref={dropdownRef}
        className={`absolute right-[10px] mt-[222px] w-36 bg-white shadow-lg rounded-lg py-2 dropdown-menu transition-transform duration-300 ease-in-out transform ${
          dropdownOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'
        } origin-top`}
      >
        <Link href="/" passHref>
          <div className="block px-4 py-3 text-gray-800 cursor-pointer hover:bg-gray-100 rounded-t-lg">Home</div>
        </Link>
        <Link href="/profile" passHref>
          <div className="block px-4 py-3 text-gray-800 cursor-pointer hover:bg-gray-100">Profile</div>
        </Link>
        <Link href="/login" passHref>
          <div className="block px-4 py-3 text-gray-800 cursor-pointer hover:bg-gray-100 rounded-b-lg">Logout</div>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
