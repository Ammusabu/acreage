'use client';

import { Home, Waves, Trees, Mountain, Sparkles, Castle, Tent, Building2 } from 'lucide-react';

const categories = [
  { id: 'all', label: 'All', icon: Home },
  { id: 'beachfront', label: 'Beachfront', icon: Waves },
  { id: 'cabins', label: 'Cabins', icon: Trees },
  { id: 'mountain', label: 'Mountain', icon: Mountain },
  { id: 'luxury', label: 'Luxury', icon: Sparkles },
  { id: 'tiny-homes', label: 'Tiny Homes', icon: Tent },
  { id: 'villas', label: 'Villas', icon: Castle },
  { id: 'apartments', label: 'Apartments', icon: Building2 },
];

interface CategoryBarProps {
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export function CategoryBar({ activeCategory, onCategoryChange }: CategoryBarProps) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a]">
      <div className="max-w-[1440px] mx-auto px-4">
        <div className="flex justify-start sm:justify-center space-x-6 sm:space-x-8 overflow-x-auto py-3 scrollbar-hide">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`flex flex-col items-center space-y-1 flex-shrink-0 transition-all duration-200 cursor-pointer ${
                  isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Icon size={20} className="sm:size-[22px]" strokeWidth={1.5} />
                <span className={`text-[10px] sm:text-xs whitespace-nowrap ${
                  isActive ? 'font-medium' : ''
                }`}>
                  {category.label}
                </span>
                {isActive && (
                  <div className="w-full h-0.5 bg-[#FF385C] mt-0.5 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
