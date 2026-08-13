'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Star, ChevronLeft, ChevronRight, Heart, Share2, 
  Sparkles, Award, Check, X, Maximize2, ArrowLeft,
  Calendar, Users, Clock, Shield, Home, MapPin
} from 'lucide-react';
import { Navbar } from '@/components/shared/Navbar';
import { listingsApi } from '@/lib/api/listings';
import { bookingsApi } from '@/lib/api/bookings';
import { Listing } from '@/lib/types';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';

// Dynamically import the map
const InteractiveMap = dynamic(
  () => import('@/components/shared/InteractiveMap').then((mod) => mod.InteractiveMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[200px] bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading map...</div>
      </div>
    ),
  }
);

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);
  
  const [listing, setListing] = useState<Listing | null>(null);
  const [nearbyListings, setNearbyListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bookingData, setBookingData] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const data = await listingsApi.getById(id);
        setListing(data);
        
        const allListings = await listingsApi.getAll({ limit: 50 });
        const nearby = allListings.filter(l => 
          l.id !== id && l.latitude && l.longitude && data.latitude && data.longitude
        ).slice(0, 10);
        setNearbyListings(nearby);
      } catch (error) {
        console.error('Failed to fetch listing:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchListing();
    }
  }, [id]);

  const handleCheckAvailability = async () => {
    if (!checkIn || !checkOut) {
      toast.error('Please select both check-in and check-out dates');
      return;
    }

    if (new Date(checkIn) < new Date()) {
      toast.error('Check-in date cannot be in the past');
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      toast.error('Check-out must be after check-in');
      return;
    }

    try {
      const data = await bookingsApi.checkAvailability(id, checkIn, checkOut);
      setBookingData(data);
      if (data.available) {
        toast.success('These dates are available!');
      } else {
        toast.error('These dates are not available. Please select different dates.');
      }
    } catch (error) {
      toast.error('Failed to check availability. Please try again.');
    }
  };

  const handleBook = async () => {
    if (!bookingData?.available) {
      toast.error('Please check availability first');
      return;
    }

    if (!checkIn || !checkOut) {
      toast.error('Please select dates');
      return;
    }

    try {
      await bookingsApi.create(
        {
          listing_id: id,
          check_in: checkIn,
          check_out: checkOut,
          guest_count: guests,
        },
        6
      );
      toast.success('Booking confirmed!');
      router.push('/trips');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to book. Please try again.');
    }
  };

  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(0)}`;
  };

  const openGallery = (index: number) => {
    setCurrentImageIndex(index);
    setIsGalleryOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
    document.body.style.overflow = 'auto';
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="max-w-[1120px] mx-auto px-4 py-4">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="grid grid-cols-2 gap-1">
              <div className="bg-gray-200 rounded-lg h-72"></div>
              <div className="bg-gray-200 rounded-lg h-72"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div>
        <Navbar />
        <div className="max-w-[1120px] mx-auto px-4 py-8">
          <h1 className="text-xl font-bold text-gray-900">Listing not found</h1>
        </div>
      </div>
    );
  }

  const images = listing.images || [];
  const mainImage = images[0] || '';
  const thumbnails = images.slice(1, 3);

  const allAmenities = [
    'Garden view', 'Kitchen', 'Wifi', 'Free parking', 
    'TV', 'Air conditioning', 'Private balcony', 
    'Security cameras', 'Washer', 'Dryer',
    'Heating', 'Smoke alarm', 'Carbon monoxide alarm', 'First aid kit',
    'Fire extinguisher', 'Iron', 'Hair dryer', 'Hot water',
    'Dedicated workspace', 'Self check-in', 'Keypad'
  ];

  const displayedAmenities = showAllAmenities ? allAmenities : allAmenities.slice(0, 8);

  const mapListings = nearbyListings.length > 0 ? [listing, ...nearbyListings] : [listing];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f0f]">
      <Navbar />
      
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button 
          onClick={() => window.history.back()}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition mb-3"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white mb-1">
          {listing.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
          <span>{listing.location}</span>
          <span className="text-gray-300 dark:text-gray-600">·</span>
          <span>{listing.max_guests} guests</span>
          <span className="text-gray-300 dark:text-gray-600">·</span>
          <span>{listing.bedrooms} bedrooms</span>
          <span className="text-gray-300 dark:text-gray-600">·</span>
          <span>{listing.beds} beds</span>
          <span className="text-gray-300 dark:text-gray-600">·</span>
          <span>{listing.bathrooms} bathrooms</span>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <button className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
            <Share2 size={16} />
            <span>Share</span>
          </button>
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
          >
            <Heart size={16} className={isFavorite ? 'fill-[#FF385C] text-[#FF385C]' : ''} />
            <span>Save</span>
          </button>
        </div>

        {/* Image Gallery + Map Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mb-6">
          {/* Left - Main Image */}
          <div className="md:col-span-2 relative bg-gray-100 dark:bg-gray-800 cursor-pointer group rounded-xl overflow-hidden h-[400px]">
            {mainImage && (
              <Image src={mainImage} alt={listing.title} fill className="object-cover hover:scale-105 transition duration-300" priority />
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition cursor-pointer" onClick={() => openGallery(0)} />
            
            {/* Image counter */}
            <div className="absolute bottom-4 left-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
              {images.length} photos
            </div>
            
            {/* Gallery button */}
            <button 
              onClick={() => openGallery(0)}
              className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 px-3 py-1.5 rounded-lg shadow-lg hover:shadow-xl transition flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <Maximize2 size={16} />
              <span>View all</span>
            </button>
          </div>

          {/* Right - Thumbnails + Map */}
          <div className="flex flex-col gap-1">
            {/* Thumbnails Grid */}
            <div className="grid grid-cols-2 gap-1">
              {thumbnails.slice(0, 2).map((image, index) => (
                <div key={index} className="relative bg-gray-100 dark:bg-gray-800 cursor-pointer group aspect-square rounded-xl overflow-hidden" onClick={() => openGallery(index + 1)}>
                  <Image src={image} alt={`Image ${index + 2}`} fill className="object-cover hover:scale-105 transition duration-300" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
                </div>
              ))}
              {/* If less than 2 thumbnails, fill with empty */}
              {thumbnails.length < 2 && (
                <div className="bg-gray-50 dark:bg-gray-800 aspect-square rounded-xl"></div>
              )}
            </div>

            {/* Map - Small */}
            <div className="relative rounded-xl overflow-hidden h-[195px]">
              <InteractiveMap listings={mapListings} center={[listing.latitude || 20.5937, listing.longitude || 78.9629]} zoom={12} />
              <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full">
                📍 {nearbyListings.length + 1} properties nearby
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {listing.rating >= 4.8 && (
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <div className="flex items-center gap-2 text-[#FF385C]">
                  <Sparkles size={18} />
                  <span className="font-semibold">Guest favourite</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                  One of the most loved homes on Acreage, according to guests
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Star size={16} className="fill-[#FF385C] text-[#FF385C]" />
                  <span className="font-semibold text-gray-900 dark:text-white">{listing.rating.toFixed(1)}</span>
                  <span className="text-gray-400 dark:text-gray-500">·</span>
                  <span className="text-gray-600 dark:text-gray-400">{listing.review_count} reviews</span>
                </div>
              </div>
            )}

            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FF385C] to-[#FF6B6B] rounded-full flex items-center justify-center text-white font-semibold text-base shadow-md">
                  {listing.host_id}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">Hosted by User {listing.host_id}</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Award size={14} className="text-[#FF385C]" />
                    <span>Superhost</span>
                    <span className="text-gray-300 dark:text-gray-600">·</span>
                    <span>10 months hosting</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{listing.description}</p>
            </div>

            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">Where you'll sleep</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Bedroom 1</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">1 double bed</p>
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Bedroom 2</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">1 double bed</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">What this place offers</h3>
              <div className="grid grid-cols-2 gap-2">
                {displayedAmenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Check size={16} className="text-gray-400 dark:text-gray-500" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
              {allAmenities.length > 8 && (
                <button 
                  onClick={() => setShowAllAmenities(!showAllAmenities)}
                  className="mt-3 text-sm font-medium text-[#FF385C] hover:underline"
                >
                  {showAllAmenities ? 'Show less' : `Show all ${allAmenities.length} amenities`}
                </button>
              )}
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg">
              <div className="mb-4">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{formatPrice(listing.price_per_night)}</span>
                <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">night</span>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Prices include all fees</p>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Star size={14} className="fill-[#FF385C] text-[#FF385C]" />
                <span className="font-medium text-sm text-gray-900 dark:text-white">{listing.rating.toFixed(1)}</span>
                <span className="text-gray-400 dark:text-gray-500 text-sm">·</span>
                <span className="text-gray-500 dark:text-gray-400 text-sm">{listing.review_count} reviews</span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="grid grid-cols-2 gap-2 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <div className="p-2 bg-white dark:bg-[#1a1a1a]">
                    <label className="block text-[10px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Check-in</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full bg-transparent border-0 outline-none text-sm text-gray-900 dark:text-white p-0"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="p-2 bg-white dark:bg-[#1a1a1a] border-l border-gray-200 dark:border-gray-700">
                    <label className="block text-[10px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Checkout</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full bg-transparent border-0 outline-none text-sm text-gray-900 dark:text-white p-0"
                      min={checkIn || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <div className="p-2 bg-white dark:bg-[#1a1a1a]">
                    <label className="block text-[10px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Guests</label>
                    <input
                      type="number"
                      min={1}
                      max={listing.max_guests}
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                      className="w-full bg-transparent border-0 outline-none text-sm text-gray-900 dark:text-white p-0"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckAvailability}
                className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-2.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition font-medium text-sm mb-3"
              >
                Check Availability
              </button>

              <button
                onClick={handleBook}
                disabled={!bookingData?.available}
                className={`w-full py-3 rounded-lg text-white font-medium text-sm shadow-md hover:shadow-lg transition ${
                  bookingData?.available
                    ? 'bg-[#FF385C] hover:bg-[#D70466]'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Reserve
              </button>

              <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                You won't be charged yet
              </p>

              {bookingData && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>{formatPrice(listing.price_per_night)} × {bookingData.nights} nights</span>
                      <span>{formatPrice(bookingData.total_price)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Service fee</span>
                      <span>{formatPrice(bookingData.service_fee)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-gray-900 dark:text-white text-base pt-2 border-t border-gray-200 dark:border-gray-700">
                      <span>Total</span>
                      <span>{formatPrice(bookingData.total_with_fees)}</span>
                    </div>
                  </div>
                </div>
              )}

              <button className="mt-4 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition">
                Report this listing
              </button>
            </div>
          </div>
        </div>

        {/* Things to know */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Things to know</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-gray-400 dark:text-gray-500" />
                <h4 className="font-medium text-sm text-gray-900 dark:text-white">Cancellation policy</h4>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Free cancellation for 48 hours. After that, cancel before check-in for a partial refund.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Home size={18} className="text-gray-400 dark:text-gray-500" />
                <h4 className="font-medium text-sm text-gray-900 dark:text-white">House rules</h4>
              </div>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <li>• Check-in: 2:00 PM – 2:00 AM</li>
                <li>• Checkout before 10:00 AM</li>
                <li>• Maximum 5 guests</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-gray-400 dark:text-gray-500" />
                <h4 className="font-medium text-sm text-gray-900 dark:text-white">Safety & property</h4>
              </div>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <li>• Exterior security cameras</li>
                <li>• Smoke alarm installed</li>
                <li>• First aid kit available</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Host Section */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">Meet your host</h3>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#FF385C] to-[#FF6B6B] rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md">
              {listing.host_id}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">User {listing.host_id}</h4>
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <span>{listing.review_count} reviews</span>
                <span className="text-gray-300 dark:text-gray-600">·</span>
                <span>{listing.rating.toFixed(1)} rating</span>
                <span className="text-gray-300 dark:text-gray-600">·</span>
                <span className="flex items-center gap-1">
                  <Award size={14} className="text-[#FF385C]" />
                  Superhost
                </span>
              </div>
              <button className="mt-2 text-sm font-medium text-[#FF385C] hover:underline">
                Message host
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={closeGallery}>
          <div className="relative w-full max-w-5xl mx-4 bg-black rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeGallery} className="absolute top-4 right-4 z-10 text-white/70 hover:text-white transition p-2 bg-black/20 rounded-full hover:bg-black/40">
              <X size={28} />
            </button>
            <div className="absolute top-4 left-4 z-10 text-white/40 text-sm bg-black/20 px-3 py-1 rounded-full">
              {currentImageIndex + 1} / {images.length}
            </div>
            <div className="relative w-full aspect-[16/10] max-h-[80vh]">
              {images[currentImageIndex] && (
                <Image src={images[currentImageIndex]} alt={`Image ${currentImageIndex + 1}`} fill className="object-contain" />
              )}
            </div>
            <button onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1)); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition p-2 bg-black/20 rounded-full hover:bg-black/40">
              <ChevronLeft size={28} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1)); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition p-2 bg-black/20 rounded-full hover:bg-black/40">
              <ChevronRight size={28} />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, index) => (
                <button key={index} onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(index); }} className={`w-2 h-2 rounded-full transition ${index === currentImageIndex ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'}`} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
