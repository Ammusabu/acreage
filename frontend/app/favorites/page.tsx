'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star, MapPin, X, Trash2 } from 'lucide-react';
import { Navbar } from '@/components/shared/Navbar';
import { favoritesApi } from '@/lib/api/favorites';
import { Listing } from '@/lib/types';
import toast from 'react-hot-toast';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await favoritesApi.getFavorites(6);
        setFavorites(data);
      } catch (error) {
        console.error('Failed to fetch favorites:', error);
        toast.error('Failed to load favorites');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (listingId: number) => {
    try {
      await favoritesApi.toggleFavorite(listingId, 6);
      setFavorites(favorites.filter((f) => f.id !== listingId));
      toast.success('Removed from favorites');
    } catch (error) {
      toast.error('Failed to remove favorite');
    }
  };

  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(0)}`;
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <Navbar />
      
      <div className="max-w-[1440px] mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Favorites</h1>
            <p className="text-sm text-gray-500 mt-1">
              {favorites.length} {favorites.length === 1 ? 'property' : 'properties'} saved
            </p>
          </div>
          {favorites.length > 0 && (
            <button 
              onClick={() => {
                if (confirm('Remove all favorites?')) {
                  favorites.forEach(f => handleRemoveFavorite(f.id));
                }
              }}
              className="text-sm text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1.5"
            >
              <Trash2 size={16} />
              <span>Clear all</span>
            </button>
          )}
        </div>

        {/* Empty State */}
        {favorites.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <div className="text-6xl mb-4">❤️</div>
            <h2 className="text-xl font-medium text-gray-700 mb-2">No favorites yet</h2>
            <p className="text-gray-500 text-sm mb-6">
              Start exploring and save your favorite places!
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
        {favorites.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {favorites.map((listing) => (
              <div key={listing.id} className="group relative">
                <Link href={`/listings/${listing.id}`} className="block">
                  {/* Image */}
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                    {listing.images && listing.images.length > 0 ? (
                      <Image
                        src={listing.images[0]}
                        alt={listing.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}
                    
                    {/* Favorite badge */}
                    <div className="absolute top-2 left-2 bg-[#FF385C] text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Heart size={10} className="fill-white" />
                      Saved
                    </div>
                  </div>
                  
                  {/* Info */}
                  <div className="mt-1.5">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-medium text-gray-900 text-sm truncate">
                        {listing.title}
                      </h3>
                      <div className="flex items-center gap-0.5 text-sm text-gray-900 flex-shrink-0">
                        <Star size={12} className="fill-[#FF385C] text-[#FF385C]" />
                        <span className="text-xs">{listing.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-500 text-xs">
                      <MapPin size={12} className="mr-0.5 flex-shrink-0" />
                      <span className="truncate">{listing.location}</span>
                    </div>
                    <div className="mt-0.5">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatPrice(listing.price_per_night)}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">night</span>
                    </div>
                  </div>
                </Link>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveFavorite(listing.id)}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition hover:scale-105 opacity-0 group-hover:opacity-100"
                  aria-label="Remove from favorites"
                >
                  <X size={14} className="text-gray-700" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
