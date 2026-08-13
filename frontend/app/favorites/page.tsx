'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star, MapPin, X, Trash2 } from 'lucide-react';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { favoritesApi } from '@/lib/api/favorites';
import { Listing } from '@/lib/types';
import toast from 'react-hot-toast';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Listing[]>([]);
  const [filteredFavorites, setFilteredFavorites] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const fetchFavorites = async () => {
    try {
      const data = await favoritesApi.getFavorites(6);
      setFavorites(data);
      setFilteredFavorites(data);
      console.log('Favorites loaded:', data);
      console.log('Property types:', data.map(l => l.property_type));
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  // Filter favorites based on tab
  useEffect(() => {
    console.log('Filtering favorites for tab:', activeTab);
    console.log('Total favorites before filter:', favorites.length);
    
    if (activeTab === 'all') {
      setFilteredFavorites(favorites);
      console.log('All favorites:', favorites.length);
    } else if (activeTab === 'homes') {
      const filtered = favorites.filter((listing) => {
        const type = listing.property_type?.toLowerCase() || '';
        const homeTypes = ['apartment', 'house', 'villa', 'cabin', 'beach house', 'tiny home', 
         'farmhouse', 'bungalow', 'cottage', 'chalet', 'loft', 'castle', 
         'treehouse', 'penthouse'];
        const match = homeTypes.some(homeType => type.includes(homeType));
        if (match) {
          console.log('Home match:', listing.title, type);
        }
        return match;
      });
      setFilteredFavorites(filtered);
      console.log('Homes filtered:', filtered.length);
    } else if (activeTab === 'experiences') {
      const filtered = favorites.filter((listing) => {
        const match = listing.rating >= 4.7;
        if (match) {
          console.log('Experience match:', listing.title, listing.rating);
        }
        return match;
      });
      setFilteredFavorites(filtered);
      console.log('Experiences filtered:', filtered.length);
    } else if (activeTab === 'services') {
      const filtered = favorites.filter((listing) => {
        const match = listing.amenities && listing.amenities.length > 0;
        if (match) {
          console.log('Services match:', listing.title, listing.amenities?.length);
        }
        return match;
      });
      setFilteredFavorites(filtered);
      console.log('Services filtered:', filtered.length);
    }
  }, [activeTab, favorites]);

  const handleRemoveFavorite = async (listingId: number) => {
    try {
      await favoritesApi.toggleFavorite(listingId, 6);
      const updatedFavorites = favorites.filter((f) => f.id !== listingId);
      setFavorites(updatedFavorites);
      setFilteredFavorites(updatedFavorites);
      toast.success('Removed from favorites');
    } catch (error) {
      toast.error('Failed to remove favorite');
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Remove all favorites?')) return;
    
    try {
      for (const fav of favorites) {
        await favoritesApi.toggleFavorite(fav.id, 6);
      }
      setFavorites([]);
      setFilteredFavorites([]);
      toast.success('All favorites removed');
    } catch (error) {
      toast.error('Failed to clear favorites');
    }
  };

  const formatPrice = (price: number) => {
    return `₹${(price / 100).toFixed(0)}`;
  };

  const getTabCount = (tab: string) => {
    if (tab === 'all') return favorites.length;
    if (tab === 'homes') {
      return favorites.filter((listing) => {
        const type = listing.property_type?.toLowerCase() || '';
        const homeTypes = ['apartment', 'house', 'villa', 'cabin', 'beach house', 'tiny home', 
         'farmhouse', 'bungalow', 'cottage', 'chalet', 'loft', 'castle', 
         'treehouse', 'penthouse'];
        return homeTypes.some(homeType => type.includes(homeType));
      }).length;
    }
    if (tab === 'experiences') {
      return favorites.filter((listing) => listing.rating >= 4.7).length;
    }
    if (tab === 'services') {
      return favorites.filter((listing) => 
        listing.amenities && listing.amenities.length > 0
      ).length;
    }
    return 0;
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="max-w-[1440px] mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mb-6"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-[#0f0f0f]">
      <Navbar />
      
      <div className="max-w-[1440px] mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">Favorites</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {favorites.length} {favorites.length === 1 ? 'property' : 'properties'} saved
            </p>
          </div>
          {favorites.length > 0 && (
            <button 
              onClick={handleClearAll}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 transition-colors flex items-center gap-1.5"
            >
              <Trash2 size={16} />
              <span>Clear all</span>
            </button>
          )}
        </div>

        {/* Tabs - Simple working tabs */}
        <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            onClick={() => {
              console.log('Switching to All tab');
              setActiveTab('all');
            }}
            className={`px-4 py-2 text-sm font-medium transition ${
              activeTab === 'all'
                ? 'text-[#FF385C] border-b-2 border-[#FF385C]'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            All ({getTabCount('all')})
          </button>
          <button
            onClick={() => {
              console.log('Switching to Homes tab');
              setActiveTab('homes');
            }}
            className={`px-4 py-2 text-sm font-medium transition ${
              activeTab === 'homes'
                ? 'text-[#FF385C] border-b-2 border-[#FF385C]'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Homes ({getTabCount('homes')})
          </button>
          <button
            onClick={() => {
              console.log('Switching to Experiences tab');
              setActiveTab('experiences');
            }}
            className={`px-4 py-2 text-sm font-medium transition ${
              activeTab === 'experiences'
                ? 'text-[#FF385C] border-b-2 border-[#FF385C]'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Experiences ({getTabCount('experiences')})
          </button>
          <button
            onClick={() => {
              console.log('Switching to Services tab');
              setActiveTab('services');
            }}
            className={`px-4 py-2 text-sm font-medium transition ${
              activeTab === 'services'
                ? 'text-[#FF385C] border-b-2 border-[#FF385C]'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Services ({getTabCount('services')})
          </button>
        </div>

        {/* Empty State */}
        {filteredFavorites.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="text-6xl mb-4">❤️</div>
            <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
              {favorites.length === 0 ? 'No favorites yet' : `No ${activeTab} favorites`}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              {favorites.length === 0 
                ? 'Start exploring and save your favorite places!' 
                : `You don't have any ${activeTab} in your favorites.`}
            </p>
            <Link 
              href="/" 
              className="inline-block bg-[#FF385C] text-white px-6 py-2.5 rounded-lg hover:bg-[#D70466] transition text-sm font-medium"
            >
              Explore stays
            </Link>
          </div>
        )}

        {/* Favorites Grid */}
        {filteredFavorites.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredFavorites.map((listing) => (
              <div key={listing.id} className="group relative bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
                <Link href={`/listings/${listing.id}`} className="block">
                  <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-800">
                    {listing.images && listing.images.length > 0 ? (
                      <Image
                        src={listing.images[0]}
                        alt={listing.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                        No image
                      </div>
                    )}
                    
                    {/* Favorite badge */}
                    <div className="absolute top-2 left-2 bg-[#FF385C] text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Heart size={10} className="fill-white" />
                      Saved
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm truncate flex-1 pr-2">
                        {listing.title}
                      </h3>
                      <div className="flex items-center gap-0.5 text-sm text-gray-900 dark:text-white flex-shrink-0">
                        <Star size={12} className="fill-[#FF385C] text-[#FF385C]" />
                        <span className="text-xs">{listing.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs">
                      <MapPin size={12} className="mr-0.5 flex-shrink-0" />
                      <span className="truncate">{listing.location}</span>
                    </div>
                    <div className="mt-0.5">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formatPrice(listing.price_per_night)}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">night</span>
                    </div>
                  </div>
                </Link>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveFavorite(listing.id)}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition hover:scale-105 opacity-0 group-hover:opacity-100"
                  aria-label="Remove from favorites"
                >
                  <X size={14} className="text-gray-700 dark:text-gray-300" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
