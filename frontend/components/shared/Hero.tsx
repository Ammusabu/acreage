'use client';

import { useState } from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { SearchModal } from './SearchModal';

export function Hero() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <div className="relative bg-gradient-to-br from-[#172B3A] via-[#1E3A4F] to-[#2A4A5F] overflow-hidden">
        <div className="relative max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center py-4 sm:py-6 lg:py-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-1 rounded-full mb-2 sm:mb-3 border border-white/10 mx-auto">
              <span className="w-1.5 h-1.5 bg-[#FF385C] rounded-full animate-pulse"></span>
              <span className="text-white/80 text-[10px] sm:text-xs font-medium tracking-wide">Discover your perfect stay</span>
            </div>
            
            {/* Heading */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl text-white font-bold mb-1.5 sm:mb-2 leading-tight tracking-tight px-2">
              Find your next<br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-[#FF385C] via-[#FF6B6B] to-[#FF8A8A] bg-clip-text text-transparent">
                stay with Acreage
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-white/60 text-xs sm:text-sm lg:text-base mb-3 sm:mb-4 max-w-2xl mx-auto leading-relaxed font-light px-4">
              Handpicked accommodations for every journey — from cozy cabins to luxury villas.
            </p>
            
            {/* Search Button - Airbnb Style */}
            <div className="flex justify-center">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-full max-w-2xl"
              >
                <div className="flex items-center justify-between px-1.5 py-1">
                  <div className="flex items-center gap-0.5 flex-1">
                    {/* Where */}
                    <div className="flex-1 px-3 py-1.5 hover:bg-gray-50 rounded-full transition text-left">
                      <div className="text-[10px] font-semibold text-gray-700">Where</div>
                      <div className="text-xs text-gray-400">Search destinations</div>
                    </div>
                    <div className="h-8 w-px bg-gray-200"></div>
                    
                    {/* When */}
                    <div className="flex-1 px-3 py-1.5 hover:bg-gray-50 rounded-full transition text-left">
                      <div className="text-[10px] font-semibold text-gray-700">When</div>
                      <div className="text-xs text-gray-400">Add dates</div>
                    </div>
                    <div className="h-8 w-px bg-gray-200"></div>
                    
                    {/* Who */}
                    <div className="flex-1 px-3 py-1.5 hover:bg-gray-50 rounded-full transition text-left">
                      <div className="text-[10px] font-semibold text-gray-700">Who</div>
                      <div className="text-xs text-gray-400">Add guests</div>
                    </div>
                  </div>
                  
                  {/* Pink Search Button */}
                  <div className="bg-[#FF385C] text-white rounded-full p-2 hover:bg-[#D70466] transition mx-1 flex-shrink-0 shadow-md">
                    <Search size={16} />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
