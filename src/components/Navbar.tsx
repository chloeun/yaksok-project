'use client'
import Link from 'next/link';
import { IoHomeOutline } from 'react-icons/io5';
import { FiUser } from 'react-icons/fi';
import { MdOutlineLogout } from 'react-icons/md';
import { RxHamburgerMenu } from 'react-icons/rx';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const iconColor = "#737370";
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest('.dropdown-menu') && !(event.target as HTMLElement).closest('.hamburger-button')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="w-full bg-white shadow-md p-4 flex justify-between items-center relative">
      <div className="flex items-center">
        <h1 className="text-xl font-bold tracking-wider">YAKSOK</h1>
      </div>
      <div className="space-x-4 flex">
        <Link href="/" passHref>
          <div className="text-gray-600 cursor-pointer flex items-center space-x-2">
            <IoHomeOutline color={iconColor} size={24} />
            <span className="hidden md:inline">Home</span>
          </div>
        </Link>
        <Link href="/profile" passHref>
          <div className="text-gray-600 cursor-pointer flex items-center space-x-2">
            <FiUser color={iconColor} size={24} />
            <span className="hidden md:inline">Profile</span>
          </div>
        </Link>
        <Link href="/login" passHref>
          <div className="text-gray-600 cursor-pointer flex items-center space-x-2">
            <MdOutlineLogout color={iconColor} size={24} />
            <span className="hidden md:inline">Logout</span>
          </div>
        </Link>
        <button className="text-gray-600" onClick={toggleDropdown}>
          <RxHamburgerMenu color={iconColor} size={24} />
        </button>
      </div>
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 dropdown-menu">
          <Link href="/" passHref>
            <div className="block px-4 py-2 text-gray-800 cursor-pointer">Home</div>
          </Link>
          <Link href="/profile" passHref>
            <div className="block px-4 py-2 text-gray-800 cursor-pointer">Profile</div>
          </Link>
          <Link href="/login" passHref>
            <div className="block px-4 py-2 text-gray-800 cursor-pointer">Logout</div>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
