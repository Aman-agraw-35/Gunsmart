"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Rubik_Spray_Paint } from 'next/font/google';

const roboto = Rubik_Spray_Paint({
  weight: '400',
  subsets: ['latin'],
});

const Header = () => {
  const router = useRouter();
  const [isProfileCardVisible, setProfileCardVisible] = useState(false);
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/check', {
          method: 'GET',
          credentials: 'include'
        });
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, []);

  const toggleProfileCard = () => {
    setProfileCardVisible(!isProfileCardVisible);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'GET',
        credentials: 'include'
      });
      setUser(null);
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed top-0 w-full bg-black border-b-2 justify-center flex items-center border-white z-50 h-20">
      <div className="flex justify-between h-10 bg-black w-[90%] items-center">
        <Link href="/" className={roboto.className}>
          <h1 className="bg-black text-3xl  md:text-5xl pt-1 h-full float-left w-max cursor-pointer">Guns-Mart</h1>
        </Link>
        
        <div className="flex items-center gap-4" aria-busy={authLoading}>
          {authLoading ? (
            <div className="flex items-center md:gap-3 gap-2">
              <div className="w-20 h-8 rounded-md bg-white/30 animate-pulse sm:w-24 sm:h-9" aria-hidden="true" />
              <div className="w-20 h-8 rounded-md bg-white/30 animate-pulse sm:w-24 sm:h-9" aria-hidden="true" />
            </div>
          ) : !user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/login">
                <button className="bg-[#b5865d] hover:bg-[#96724d] text-white px-4 py-1.5 sm:px-5 sm:py-2 rounded-lg transition-colors duration-200 text-sm sm:text-base font-medium border border-[#b5865d] hover:border-[#96724d]">
                  Login
                </button>
              </Link>
              <Link href="/signup">
                <button className="bg-transparent text-[#b5865d] hover:text-white hover:bg-[#b5865d] px-4 py-1.5 sm:px-5 sm:py-2 rounded-lg transition-colors duration-200 text-sm sm:text-base font-medium border border-[#b5865d]">
                  Sign Up
                </button>
              </Link>
            </div>
          ) : (
            <div
              className="ml-auto w-[43px] right-0 bg-black h-[43px] relative cursor-pointer"
              onClick={toggleProfileCard}
            >
              <Image
                className="w-[55px] bg-black h-[55px] pb-2 object-cover rounded-full"
                src="/images/profile.png" 
                width={50}
                height={50}
                alt="Profile"
              />
              {isProfileCardVisible && (
                <div className="absolute z-30 top-full right-[-15px] mt-6 w-max bg-white p-4 rounded-md shadow-md">
                  <h2 className="text-2xl bg-white font-semibold text-black">{user.username}</h2>
                  <h2 className="text-xl bg-white font-medium mb-2 text-black">{user.email}</h2>
                  <button 
                    onClick={handleLogout}
                    className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
