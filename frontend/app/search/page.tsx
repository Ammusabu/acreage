'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star, MapPin, Search, SlidersHorizontal, Calendar, Users, LayoutGrid, Map } from 'lucide-react';
import { Navbar } from '@/components/shared/Navbar';
import { listingsApi } from '@/lib/api/listings';
import { Listing } from '@/lib/types';
import toast from 'react-hot-toast';
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

function SearchContent() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const location = searchParams?.get('location') || '';
  const guests = searchParams?.get('guests') || '';
  const checkIn = searchParams?.get('check_in') || '';
  const checkOut = searchParams?.get('check_out') || '';
  const type = searchParams?.get('type') || '';

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const params: any = { limit: 30 };
        if (location) params.location = location;
        const data = await listingsApi.getAll(params);
        
        let filtered = data;
        if (type === 'homes') {
          filtered = filtered.filter((l: Listing) => 
            ['Apartment', 'House', 'Villa', 'Cabin', 'Beach House', 'Tiny Home', 'Farmhouse', 'Bungalow', 'Cottage', 'Chalet'].includes(l.property_type)
          );
        } else if (type === 'experiences') {
          filtered = filtered.filter((l: Listing) => l.rating >= 4.7);
        } else if (type === 'services') {
          filtered = filtered.filter((l: Listing) => l.amenities && l.amenities.length > 5);
        }
        
        if (guests && parseInt(guests) > 0) {
          const guestCount = parseInt(guests);
          filtered = filtered.filter((listing: Listing) => listing.max_guests >= guestCount);
        }
        setListings(filtered);
      } catch (error) {
        console.error('Failed to fetch listings:', error);
        toast.error('Failed to load listings');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [location, guests, type]);

  const formatPrice = (price: number) => {
    return `₹${(price / 100).toFixed(0)}`;
  };

  const toggleFavorite = (listingId: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(listingId)) {
        newFavorites.delete(listingId);
      } else {
        newFavorites.add(listingId);
      }
      localStorage.setItem('favorites', JSON.stringify(Array.from(newFavorites)));
      return newFavorites;
    });
  };

  const clearSearch = () => {
    window.location.href = '/';
  };

  const getTitle = () => {
    if (type === 'homes') return 'Homes';
    if (type === 'experiences') return 'Experiences';
    if (type === 'services') return 'Services';
    if (location) return `Homes in ${location}`;
    return 'All properties';
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-[#0f0f0f]">
      <Navbar />
      
      <div className="bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-[1440px] mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center gap-2 max-w-4xl">
            <div className="flex-1 min-w-[200px] flex items-center bg-[#FAFAF9] dark:bg-[#0f0f0f] rounded-full border border-gray-200 dark:border-gray-700 px-4 py-2 hover:border-gray-300 dark:hover:border-gray-600 transition">
              <Search size={18} className="text-gray-400 dark:text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search destinations"
                defaultValue={location}
                className="bg-transparent border-none outline-none flex-1 text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const value = (e.target as HTMLInputElement).value;
                    if (value.trim()) {
                      window.location.href = `/search?location=${encodeURIComponent(value.trim())}`;
                    }
                  }
                }}
              />
            </div>
            <button className="flex items-center gap-2 bg-[#FAFAF9] dark:bg-[#0f0f0f] border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 hover:border-gray-300 dark:hover:border-gray-600 transition text-sm text-gray-700 dark:text-gray-300">
              <Calendar size={16} />
              <span>{checkIn && checkOut ? `${checkIn} - ${checkOut}` : 'Add dates'}</span>
            </button>
            <button className="flex items-center gap-2 bg-[#FAFAF9] dark:bg-[#0f0f0f] border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 hover:border-gray-300 dark:hover:border-gray-600 transition text-sm text-gray-700 dark:text-gray-300">
              <Users size={16} />
              <span>{guests || 'Guests'}</span>
            </button>
            <button className="bg-[#FF385C] text-white rounded-full p-2 hover:bg-[#D70466] transition">
              <Search size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800 py-3">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
              <button className="flex items-center gap-2 px-4 py-1.5 bg-[#FAFAF9] dark:bg-[#0f0f0f] border border-gray-200 dark:border-gray-700 rounded-full hover:border-gray-400 dark:hover:border-gray-600 transition text-sm whitespace-nowrap text-gray-700 dark:text-gray-300">
                <SlidersHorizontal size={14} />
                Filters
              </button>
              <button className="px-4 py-1.5 bg-[#FAFAF9] dark:bg-[#0f0f0f] border border-gray-200 dark:border-gray-700 rounded-full hover:border-gray-400 dark:hover:border-gray-600 transition text-sm whitespace-nowrap text-gray-700 dark:text-gray-300">
                Price
              </button>
              <button className="px-4 py-1.5 bg-[#FAFAF9] dark:bg-[#0f0f0f] border border-gray-200 dark:border-gray-700 rounded-full hover:border-gray-400 dark:hover:border-gray-600 transition text-sm whitespace-nowrap text-gray-700 dark:text-gray-300">
                Property type
              </button>
              <button className="px-4 py-1.5 bg-[#FAFAF9] dark:bg-[#0f0f0f] border border-gray-200 dark:border-gray-700 rounded-full hover:border-gray-400 dark:hover:border-gray-600 transition text-sm whitespace-nowrap text-gray-700 dark:text-gray-300">
                Rooms
              </button>
            </div>
            
            <div className="flex items-center gap-1 bg-[#FAFAF9] dark:bg-[#0f0f0f] border border-gray-200 dark:border-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''}`}
              >
                <LayoutGrid size={16} className="text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-1.5 rounded-md transition ${viewMode === 'map' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''}`}
              >
                <Map size={16} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 py-4">
        <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            {loading ? 'Searching...' : `${listings.length} ${getTitle()}`}
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <button className="hover:text-gray-700 dark:hover:text-gray-300 transition">Sort by</button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="w-40 h-32 bg-gray-200 dark:bg-gray-800 rounded-xl flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No properties found</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              We couldn't find any properties matching your search.
            </p>
            <button 
              onClick={clearSearch}
              className="inline-block bg-[#FF385C] text-white px-6 py-2.5 rounded-lg hover:bg-[#D70466] transition text-sm font-medium"
            >
              Clear search
            </button>
          </div>
        ) : viewMode === 'map' ? (
          <div className="h-[600px]">
            <InteractiveMap listings={listings} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {listings.map((listing) => (
              <Link
                key={listing.id}
                href={`/listings/${listing.id}`}
                className="flex gap-4 bg-white dark:bg-[#1a1a1a] rounded-xl hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700 overflow-hidden group"
              >
                <div className="relative w-40 h-32 flex-shrink-0">
                  {listing.images && listing.images.length > 0 ? (
                    <Image
                      src={listing.images[0]}
                      alt={listing.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 160px"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <span className="text-gray-400 dark:text-gray-500 text-xs">No image</span>
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(listing.id);
                    }}
                    className="absolute top-1.5 right-1.5 p-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-sm hover:shadow-md transition"
                  >
                    <Heart
                      size={14}
                      className={favorites.has(listing.id) ? 'fill-[#FF385C] text-[#FF385C]' : 'text-gray-700 dark:text-gray-300'}
                    />
                  </button>
                </div>

                <div className="flex-1 py-2 pr-3 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-medium text-sm text-gray-900 dark:text-white truncate">
                      {listing.title}
                    </h3>
                    <div className="flex items-center gap-0.5 text-sm text-gray-900 dark:text-white flex-shrink-0">
                      <Star size={12} className="fill-[#FF385C] text-[#FF385C]" />
                      <span className="text-xs">{listing.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    <MapPin size={10} className="mr-0.5 flex-shrink-0" />
                    <span className="truncate">{listing.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>{listing.max_guests} guests</span>
                    <span>•</span>
                    <span>{listing.bedrooms} bedrooms</span>
                    <span>•</span>
                    <span>{listing.beds} beds</span>
                  </div>
                  <div className="mt-1.5">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatPrice(listing.price_per_night)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">night</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAFAF9] dark:bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
