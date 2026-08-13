'use client';

import Link from 'next/link';
import { Menu, User, Heart, Globe, Plus, X, Home, Building2, Balloon, Bell, LogIn, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { LoginModal } from './LoginModal';
import { useAuth } from '@/context/AuthContext';

interface NavbarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function Navbar({ activeTab = 'all', onTabChange }: NavbarProps) {
  const { user, logout, isAuthenticated, isHost } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(activeTab);

  useEffect(() => {
    setCurrentTab(activeTab);
  }, [activeTab]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTabClick = (tab: string) => {
    setCurrentTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    window.location.reload();
  };

  const handleLogoClick = () => {
    window.location.href = '/';
  };

  return (
    <>
      <nav className="bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <button 
              onClick={handleLogoClick}
              className="flex items-center gap-2.5 flex-shrink-0 group cursor-pointer"
            >
              <div className="w-8 h-8 bg-[#FF385C] rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1m-2 0h2" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-[#FF385C] tracking-tight">acreage</span>
            </button>

            <div className="hidden md:flex items-center justify-center flex-1 space-x-2">
              <button onClick={() => handleTabClick('all')} className={`flex items-center gap-2 px-5 py-2.5 text-base font-medium rounded-full transition ${currentTab === 'all' ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                <Home size={18} strokeWidth={1.5} /><span>All</span>
              </button>
              <button onClick={() => handleTabClick('homes')} className={`flex items-center gap-2 px-5 py-2.5 text-base font-medium rounded-full transition ${currentTab === 'homes' ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                <Building2 size={18} strokeWidth={1.5} /><span>Homes</span>
              </button>
              <button onClick={() => handleTabClick('experiences')} className={`flex items-center gap-2 px-5 py-2.5 text-base font-medium rounded-full transition ${currentTab === 'experiences' ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                <Balloon size={18} strokeWidth={1.5} /><span>Experiences</span>
              </button>
              <button onClick={() => handleTabClick('services')} className={`flex items-center gap-2 px-5 py-2.5 text-base font-medium rounded-full transition ${currentTab === 'services' ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                <Bell size={18} strokeWidth={1.5} /><span>Services</span>
              </button>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <Link href="/host" className="hidden md:flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-2 rounded-full transition-all duration-200 whitespace-nowrap">
                <Plus size={16} strokeWidth={2} /><span>Become a host</span>
              </Link>
              
              <ThemeToggle />
              <button className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <Globe size={20} strokeWidth={2} />
              </button>
              <Link href="/favorites" className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white relative">
                <Heart size={20} strokeWidth={2} />
              </Link>

              <div className="relative">
                {isAuthenticated ? (
                  <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-full px-3 py-2 hover:shadow-md transition-all duration-200 bg-white dark:bg-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-gray-800">
                    <Menu size={16} className="text-gray-700 dark:text-gray-300" strokeWidth={2} />
                    <User size={16} className="text-gray-700 dark:text-gray-300" strokeWidth={2} />
                  </button>
                ) : (
                  <button onClick={() => setIsLoginModalOpen(true)} className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 hover:shadow-md transition-all duration-200 bg-white dark:bg-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-gray-800">
                    <LogIn size={16} className="text-gray-700 dark:text-gray-300" strokeWidth={2} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Login</span>
                  </button>
                )}

                {isMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 overflow-hidden">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role === 'guest' ? '👤 Guest' : '🏠 Host'}</p>
                    </div>
                    <Link href="/trips" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 text-sm text-gray-700 dark:text-gray-300" onClick={() => setIsMenuOpen(false)}>
                      <span className="text-gray-400 dark:text-gray-500">📅</span>My Trips
                    </Link>
                    <Link href="/favorites" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 text-sm text-gray-700 dark:text-gray-300" onClick={() => setIsMenuOpen(false)}>
                      <span className="text-gray-400 dark:text-gray-500">❤️</span>Favorites
                    </Link>
                    {isHost && (
                      <Link href="/host" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 text-sm text-gray-700 dark:text-gray-300" onClick={() => setIsMenuOpen(false)}>
                        <span className="text-gray-400 dark:text-gray-500">🏠</span>Host Dashboard
                      </Link>
                    )}
                    <hr className="my-1 border-gray-200 dark:border-gray-700" />
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 text-sm text-gray-700 dark:text-gray-300 w-full text-left">
                      <LogOut size={16} className="text-gray-400 dark:text-gray-500" />Log out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a]">
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between px-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</span>
                <ThemeToggle />
              </div>
              <Link href="/host" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm font-medium text-gray-700 dark:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>
                <Plus size={18} className="text-gray-500 dark:text-gray-400" />Become a host
              </Link>
              <Link href="/favorites" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm font-medium text-gray-700 dark:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>
                <Heart size={18} className="text-gray-500 dark:text-gray-400" />Favorites
              </Link>
              <Link href="/trips" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm font-medium text-gray-700 dark:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>
                <span>📅</span>My Trips
              </Link>
              <hr className="border-gray-200 dark:border-gray-700" />
              {isAuthenticated ? (
                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm font-medium text-gray-700 dark:text-gray-300 w-full text-left">
                  <LogOut size={18} className="text-gray-500 dark:text-gray-400" />Log out
                </button>
              ) : (
                <button onClick={() => setIsLoginModalOpen(true)} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm font-medium text-gray-700 dark:text-gray-300 w-full text-left">
                  <LogIn size={18} className="text-gray-500 dark:text-gray-400" />Login
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}
