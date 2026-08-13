'use client';

import { useState } from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { SearchModal } from './SearchModal';

export function SearchBar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <div className="bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800 py-4">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="flex justify-center">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="bg-white dark:bg-[#1a1a1a] rounded-full border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 w-full max-w-4xl"
            >
              <div className="flex items-center justify-between px-2 py-1">
                <div className="flex items-center flex-1">
                  {/* Where */}
                  <div className="flex-1 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition text-left">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-[#FF385C] flex-shrink-0" strokeWidth={1.5} />
                      <div>
                        <div className="text-[10px] font-semibold text-gray-700 dark:text-gray-300">Where</div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">Search destinations</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 flex-shrink-0"></div>
                  
                  {/* When */}
                  <div className="flex-1 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition text-left">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-[#FF385C] flex-shrink-0" strokeWidth={1.5} />
                      <div>
                        <div className="text-[10px] font-semibold text-gray-700 dark:text-gray-300">When</div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">Add dates</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 flex-shrink-0"></div>
                  
                  {/* Who */}
                  <div className="flex-1 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition text-left">
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-[#FF385C] flex-shrink-0" strokeWidth={1.5} />
                      <div>
                        <div className="text-[10px] font-semibold text-gray-700 dark:text-gray-300">Who</div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">Add guests</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FF385C] text-white rounded-full p-2.5 hover:bg-[#D70466] transition mx-1 flex-shrink-0 shadow-md">
                  <Search size={18} strokeWidth={2} />
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
