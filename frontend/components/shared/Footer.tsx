'use client';

import Link from 'next/link';
import { Globe } from 'lucide-react';
import { useEffect, useState } from 'react';
import { listingsApi } from '@/lib/api/listings';

export function Footer() {
  const [destinations, setDestinations] = useState<{name: string, type: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const listings = await listingsApi.getAll({ limit: 100 });
        const locationMap = new Map();
        listings.forEach((listing: any) => {
          if (!locationMap.has(listing.location)) {
            locationMap.set(listing.location, {
              name: listing.location,
              type: listing.property_type || 'Property'
            });
          }
        });
        const uniqueLocations = Array.from(locationMap.values()).slice(0, 16);
        setDestinations(uniqueLocations);
      } catch (error) {
        console.error('Failed to fetch destinations:', error);
        setDestinations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  return (
    <footer className="bg-white dark:bg-[#1a1a1a] border-t border-gray-200 dark:border-gray-800 mt-8">
      {/* Inspiration Section */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          Discover your next stay
        </h3>
        
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['All', 'Beachfront', 'Cabins', 'Mountain', 'Luxury', 'Villas', 'Apartments'].map((category) => (
            <Link
              key={category}
              href={`/?category=${category.toLowerCase()}`}
              className="px-4 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
            >
              {category}
            </Link>
          ))}
        </div>

        {/* Destination Grid - From Database */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-y-2 gap-x-4 mb-8">
          {loading ? (
            [...Array(12)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-1"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
            ))
          ) : destinations.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 col-span-full">No destinations available</p>
          ) : (
            destinations.map((dest) => (
              <Link
                key={dest.name}
                href={`/search?location=${encodeURIComponent(dest.name)}`}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:underline transition"
              >
                {dest.name.split(',')[0]}
                <span className="text-xs text-gray-400 dark:text-gray-500 block">{dest.type}</span>
              </Link>
            ))
          )}
        </div>

        {/* Show More */}
        <button className="text-sm font-medium text-[#FF385C] hover:underline mb-8">
          Explore more destinations
        </button>
      </div>

      {/* Main Footer - Acreage Branding */}
      <div className="border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
            {/* Explore */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">Explore</h4>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li><Link href="/" className="hover:text-gray-900 dark:hover:text-white transition">Discover Stays</Link></li>
                <li><Link href="/search" className="hover:text-gray-900 dark:hover:text-white transition">Popular Destinations</Link></li>
                <li><Link href="/favorites" className="hover:text-gray-900 dark:hover:text-white transition">Wishlist</Link></li>
                <li><Link href="/search?sort=rating" className="hover:text-gray-900 dark:hover:text-white transition">Top Rated</Link></li>
              </ul>
            </div>
            
            {/* For Hosts */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">For Hosts</h4>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li><Link href="/host" className="hover:text-gray-900 dark:hover:text-white transition">List Your Property</Link></li>
                <li><Link href="/host" className="hover:text-gray-900 dark:hover:text-white transition">Host Dashboard</Link></li>
                <li><Link href="/host" className="hover:text-gray-900 dark:hover:text-white transition">Hosting Resources</Link></li>
                <li><Link href="/host" className="hover:text-gray-900 dark:hover:text-white transition">Become a Host</Link></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li><Link href="/" className="hover:text-gray-900 dark:hover:text-white transition">Help Center</Link></li>
                <li><Link href="/" className="hover:text-gray-900 dark:hover:text-white transition">Safety Information</Link></li>
                <li><Link href="/" className="hover:text-gray-900 dark:hover:text-white transition">Cancellation Options</Link></li>
                <li><Link href="/" className="hover:text-gray-900 dark:hover:text-white transition">Contact Us</Link></li>
              </ul>
            </div>
            
            {/* Company */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li><Link href="/" className="hover:text-gray-900 dark:hover:text-white transition">About Acreage</Link></li>
                <li><Link href="/" className="hover:text-gray-900 dark:hover:text-white transition">Careers</Link></li>
                <li><Link href="/" className="hover:text-gray-900 dark:hover:text-white transition">Privacy</Link></li>
                <li><Link href="/" className="hover:text-gray-900 dark:hover:text-white transition">Terms</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex flex-wrap items-center gap-4">
              <span>© 2026 Acreage, Inc.</span>
              <span className="hidden sm:inline">·</span>
              <Link href="/" className="hover:text-gray-900 dark:hover:text-white transition">Privacy</Link>
              <span>·</span>
              <Link href="/" className="hover:text-gray-900 dark:hover:text-white transition">Terms</Link>
              <span>·</span>
              <Link href="/" className="hover:text-gray-900 dark:hover:text-white transition">Company details</Link>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1.5 hover:text-gray-900 dark:hover:text-white transition">
                <Globe size={16} />
                <span>English (IN)</span>
              </button>
              <span>₹ INR</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
