'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star, MapPin } from 'lucide-react';
import { Listing } from '@/lib/types';
import { useState } from 'react';

interface ListingCardProps {
  listing: Listing;
  onFavoriteToggle?: (listingId: number) => void;
}

export function ListingCard({ listing, onFavoriteToggle }: ListingCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
    onFavoriteToggle?.(listing.id);
  };

  const formatPrice = (price: number) => {
    return `₹${(price / 100).toFixed(0)}`;
  };

  const imageUrl = listing.images && listing.images.length > 0 
    ? listing.images[0] 
    : 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop';

  // Check if this is a guest favourite (rating >= 4.8)
  const isGuestFavourite = listing.rating >= 4.8;

  return (
    <Link href={`/listings/${listing.id}`} className="block group">
      <div className="relative">
        {/* Image */}
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
          <Image
            src={imageUrl}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          
          {/* Favorite Button */}
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

          {/* Guest Favorite Badge - Only show for high rated listings */}
          {isGuestFavourite && (
            <div className="absolute bottom-2 left-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
              <Star size={10} className="fill-[#FF385C] text-[#FF385C]" />
              <span className="text-[9px] font-medium text-gray-900 dark:text-white whitespace-nowrap">
                Guest favourite
              </span>
            </div>
          )}
        </div>

        {/* Info - Airbnb Style Compact */}
        <div className="mt-1.5">
          {/* Title and Rating */}
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
          
          {/* Location */}
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-[10px] mt-0.5">
            <span className="truncate">{listing.location}</span>
          </div>
          
          {/* Price */}
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
