'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { SearchBar } from '@/components/shared/SearchBar';
import { CategoryBar } from '@/components/shared/CategoryBar';
import { Footer } from '@/components/shared/Footer';
import { SectionWithScroll } from '@/components/shared/SectionWithScroll';
import { listingsApi } from '@/lib/api/listings';
import { Listing } from '@/lib/types';
import { Map } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import the map to avoid SSR issues
const InteractiveMap = dynamic(
  () => import('@/components/shared/InteractiveMap').then((mod) => mod.InteractiveMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading map...</div>
      </div>
    ),
  }
);

export default function HomePage() {
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await listingsApi.getAll({ limit: 50 });
        setAllListings(data);
        setFilteredListings(data);
        console.log('Total listings fetched:', data.length);
      } catch (error) {
        console.error('Failed to fetch listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  useEffect(() => {
    console.log('Active Tab:', activeTab);
    console.log('Active Category:', activeCategory);
    
    let filtered = allListings;

    if (activeTab === 'homes') {
      filtered = filtered.filter((l) => 
        ['Apartment', 'House', 'Villa', 'Cabin', 'Beach House', 'Tiny Home', 
         'Farmhouse', 'Bungalow', 'Cottage', 'Chalet', 'Loft', 'Castle', 
         'Treehouse', 'Penthouse'].includes(l.property_type)
      );
    } else if (activeTab === 'experiences') {
      filtered = filtered.filter((l) => l.rating >= 4.7);
    } else if (activeTab === 'services') {
      filtered = filtered.filter((l) => l.amenities && l.amenities.length > 0);
    }

    if (activeCategory !== 'all') {
      filtered = filtered.filter((listing) => {
        const propertyType = listing.property_type?.toLowerCase() || '';
        const title = listing.title?.toLowerCase() || '';
        
        const categoryMap: Record<string, string[]> = {
          beachfront: ['beach house', 'beachfront', 'beach', 'coastal'],
          cabins: ['cabin', 'cottage'],
          mountain: ['cabin', 'chalet', 'mountain'],
          luxury: ['villa', 'penthouse', 'luxury', 'mansion'],
          'tiny-homes': ['tiny home', 'tiny house'],
          villas: ['villa', 'estate'],
          apartments: ['apartment', 'loft', 'condo', 'flat'],
        };
        
        const keywords = categoryMap[activeCategory] || [];
        return keywords.some(keyword => 
          propertyType.includes(keyword) || 
          title.includes(keyword)
        );
      });
    }

    setFilteredListings(filtered.length > 0 ? filtered : allListings);
  }, [activeTab, activeCategory, allListings]);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const displayListings = filteredListings;

  const popularListings = displayListings.slice(0, 12);
  
  const weekendListings = displayListings
    .filter(l => l.rating >= 4.5 && l.price_per_night <= 20000)
    .slice(0, 12);
  
  const topRatedListings = displayListings
    .filter(l => l.rating >= 4.8)
    .slice(0, 12);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] dark:bg-[#0f0f0f]">
        <Navbar activeTab={activeTab} onTabChange={handleTabChange} />
        <SearchBar />
        <CategoryBar 
          activeCategory={activeCategory} 
          onCategoryChange={handleCategoryChange} 
        />
        <main className="container-acreage py-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-3">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                <div className="mt-1.5 h-2.5 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                <div className="mt-1 h-2 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getTitle = () => {
    if (activeTab === 'homes') return 'Homes';
    if (activeTab === 'experiences') return 'Experiences';
    if (activeTab === 'services') return 'Services';
    if (activeCategory !== 'all') return `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} stays`;
    return 'Popular stays';
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-[#0f0f0f]">
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />
      <SearchBar />
      <CategoryBar 
        activeCategory={activeCategory} 
        onCategoryChange={handleCategoryChange} 
      />

      <main className="container-acreage py-4 lg:py-5">
        {/* Map Toggle Button */}
        <div className="flex justify-end mb-3">
          <button
            onClick={() => setShowMap(!showMap)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-full hover:shadow-md transition text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            <Map size={16} />
            {showMap ? 'Hide Map' : 'Show Map'}
          </button>
        </div>

        {/* Map Section */}
        {showMap && (
          <div className="mb-6">
            <InteractiveMap listings={displayListings} />
          </div>
        )}

        <SectionWithScroll 
          title={`${getTitle()} (${displayListings.length} properties)`}
          listings={popularListings}
          viewAllLink={`/search?tab=${activeTab}&category=${activeCategory}`}
        />
        
        {weekendListings.length > 0 && (
          <SectionWithScroll 
            title="Available this weekend" 
            listings={weekendListings}
            viewAllLink="/search?availability=weekend"
          />
        )}
        
        {topRatedListings.length > 0 && (
          <SectionWithScroll 
            title="Top-rated stays" 
            listings={topRatedListings}
            viewAllLink="/search?sort=rating"
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
