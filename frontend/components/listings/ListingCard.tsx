'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star, MapPin } from 'lucide-react';
import { Listing } from '@/lib/types';
import { useState, useEffect } from 'react';
import { favoritesApi } from '@/lib/api/favorites';

interface ListingCardProps {
  listing: Listing;
  onFavoriteToggle?: (listingId: number) => void;
}

export function ListingCard({ listing, onFavoriteToggle }: ListingCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const result = await favoritesApi.checkFavorite(listing.id, 6);
        setIsFavorite(result.favorited);
      } catch (error) {
        console.error('Failed to check favorite:', error);
      } finally {
        setLoading(false);
      }
    };
    checkFavorite();
  }, [listing.id]);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const result = await favoritesApi.toggleFavorite(listing.id, 6);
      setIsFavorite(result.favorited);
      onFavoriteToggle?.(listing.id);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const formatPrice = (price: number) => {
    return `₹${(price / 100).toFixed(0)}`;
  };

  const imageUrl = listing.images && listing.images.length > 0 
    ? listing.images[0] 
    : 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop';

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
        <div className="mt-1.5 h-2.5 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
      </div>
    );
  }

  return (
    <Link href={`/listings/${listing.id}`} className="block group">
      <div className="relative">
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
          <Image
            src={imageUrl}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          
          <button
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 p-1.5 hover:scale-110 transition"
            aria-label="Toggle favorite"
          >
            <Heart
              size={18}
              className={`drop-shadow-lg ${
                isFavorite ? 'fill-[#FF385C] text-[#FF385C]' : 'text-white'
              }`}
            />
          </button>

          {listing.rating >= 4.8 && (
            <div className="absolute bottom-2 left-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[8px] font-medium text-gray-900 dark:text-white shadow-sm flex items-center gap-0.5">
              <Star size={8} className="fill-[#FF385C] text-[#FF385C]" />
              Guest favourite
            </div>
          )}
        </div>

        <div className="mt-1.5">
          <div className="flex justify-between items-start gap-1">
            <h3 className="font-medium text-gray-900 dark:text-white text-xs leading-tight truncate flex-1">
              {listing.title}
            </h3>
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <Star size={10} className="fill-[#FF385C] text-[#FF385C]" />
              <span className="text-[10px] font-medium text-gray-900 dark:text-white">
                {listing.rating.toFixed(1)}
              </span>
            </div>
          </div>
          
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-[10px] mt-0.5">
            <span className="truncate">{listing.location}</span>
          </div>
          
          <div className="mt-1">
            <span className="font-semibold text-gray-900 dark:text-white text-xs">
              {formatPrice(listing.price_per_night)}
            </span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 ml-0.5">night</span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 mx-1">·</span>
            <span className="text-[10px] font-medium text-gray-900 dark:text-white">
              {formatPrice(listing.price_per_night * 2)} total
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
