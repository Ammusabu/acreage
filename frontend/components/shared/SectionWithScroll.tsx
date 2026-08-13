'use client';

import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ListingCard } from '@/components/listings/ListingCard';
import { Listing } from '@/lib/types';
import Link from 'next/link';

interface SectionWithScrollProps {
  title: string;
  listings: Listing[];
  showAll?: boolean;
  viewAllLink?: string;
}

export function SectionWithScroll({ title, listings, showAll = true, viewAllLink = '/search' }: SectionWithScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [listings]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 300);
    }
  };

  if (listings.length === 0) return null;

  return (
    <div className="mb-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>
        {showAll && (
          <Link 
            href={viewAllLink}
            className="flex items-center gap-1 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
          >
            <span>Show all</span>
            <ChevronRight size={16} />
          </Link>
        )}
      </div>

      {/* Scroll Container */}
      <div className="relative">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-[#1a1a1a] rounded-full shadow-lg p-2 hover:shadow-xl transition border border-gray-200 dark:border-gray-700"
          >
            <ChevronLeft size={20} className="text-gray-700 dark:text-gray-300" />
          </button>
        )}

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-[#1a1a1a] rounded-full shadow-lg p-2 hover:shadow-xl transition border border-gray-200 dark:border-gray-700"
          >
            <ChevronRight size={20} className="text-gray-700 dark:text-gray-300" />
          </button>
        )}

        {/* Scrollable Grid */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="grid grid-flow-col auto-cols-[calc(50%-0.5rem)] sm:auto-cols-[calc(33.333%-0.5rem)] md:auto-cols-[calc(25%-0.5rem)] lg:auto-cols-[calc(20%-0.5rem)] xl:auto-cols-[calc(16.666%-0.5rem)] gap-2 md:gap-3 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {listings.map((listing) => (
            <div key={listing.id} className="w-full">
              <ListingCard listing={listing} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
