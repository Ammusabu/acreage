'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Users, MapPin, ChevronRight, Star, Edit3, X } from 'lucide-react';
import { Navbar } from '@/components/shared/Navbar';
import { bookingsApi } from '@/lib/api/bookings';
import { reviewsApi } from '@/lib/api/reviews';
import { Booking } from '@/lib/types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function TripsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [navbarTab, setNavbarTab] = useState('all');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await bookingsApi.getUserBookings(6);
        setBookings(data);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleNavbarTabChange = (tab: string) => {
    setNavbarTab(tab);
    if (tab === 'all') {
      window.location.href = '/';
    } else if (tab === 'homes') {
      window.location.href = '/search?type=homes';
    } else if (tab === 'experiences') {
      window.location.href = '/search?type=experiences';
    } else if (tab === 'services') {
      window.location.href = '/search?type=services';
    }
  };

  const handleLeaveReview = (booking: Booking) => {
    setSelectedBooking(booking);
    setRating(5);
    setReviewText('');
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedBooking) return;
    if (rating < 1 || rating > 5) {
      toast.error('Please select a rating from 1 to 5');
      return;
    }

    setSubmitting(true);
    try {
      await reviewsApi.createReview(
        {
          booking_id: selectedBooking.id,
          rating: rating,
          comment: reviewText,
        },
        6
      );
      toast.success('Review submitted successfully! 🎉');
      setShowReviewModal(false);
      
      // Refresh bookings to update status
      const data = await bookingsApi.getUserBookings(6);
      setBookings(data);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(0)}`;
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; className: string }> = {
      confirmed: { label: 'Confirmed', className: 'bg-green-50 text-green-700 border-green-200' },
      pending: { label: 'Pending', className: 'bg-amber-50 text-amber-700 border-amber-200' },
      cancelled: { label: 'Cancelled', className: 'bg-red-50 text-red-700 border-red-200' },
      completed: { label: 'Completed', className: 'bg-blue-50 text-blue-700 border-blue-200' },
    };
    return configs[status] || configs.pending;
  };

  const filteredBookings = bookings.filter((booking) => {
    const today = new Date();
    const checkIn = new Date(booking.check_in);
    if (activeTab === 'upcoming') {
      return checkIn >= today && booking.status !== 'cancelled';
    } else {
      return checkIn < today || booking.status === 'cancelled';
    }
  });

  if (loading) {
    return (
      <div>
        <Navbar activeTab={navbarTab} onTabChange={handleNavbarTabChange} />
        <div className="max-w-[1200px] mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="flex space-x-6 mb-6">
              <div className="h-10 bg-gray-200 rounded w-24"></div>
              <div className="h-10 bg-gray-200 rounded w-24"></div>
            </div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
                <div className="flex gap-4">
                  <div className="w-32 h-32 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-[#0f0f0f]">
      <Navbar activeTab={navbarTab} onTabChange={handleNavbarTabChange} />
      
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">My Trips</h1>
          <span className="text-sm text-gray-500 dark:text-gray-400">{bookings.length} total bookings</span>
        </div>
        
        <div className="flex space-x-6 border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`pb-3 px-1 font-medium transition ${
              activeTab === 'upcoming'
                ? 'border-b-2 border-[#FF385C] text-[#FF385C]'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`pb-3 px-1 font-medium transition ${
              activeTab === 'past'
                ? 'border-b-2 border-[#FF385C] text-[#FF385C]'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            Past
          </button>
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="text-6xl mb-4">✈️</div>
            <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No {activeTab} trips</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              {activeTab === 'upcoming' 
                ? 'You don\'t have any upcoming trips planned.' 
                : 'You don\'t have any past trips yet.'}
            </p>
            <Link href="/" className="inline-block bg-[#FF385C] text-white px-6 py-2.5 rounded-lg hover:bg-[#D70466] transition text-sm font-medium">
              Explore stays
            </Link>
          </div>
        )}

        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const statusConfig = getStatusConfig(booking.status);
            const isCompleted = booking.status === 'completed';
            
            return (
              <div key={booking.id} className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="flex flex-col sm:flex-row">
                  <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0">
                    {booking.listing_image ? (
                      <Image
                        src={booking.listing_image}
                        alt={booking.listing_title || 'Listing'}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 192px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <span className="text-gray-400 dark:text-gray-500 text-sm">No image</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg">
                          {booking.listing_title || 'Property'}
                        </h3>
                        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.className}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-2">
                        <MapPin size={14} className="mr-1 flex-shrink-0" />
                        <span>{booking.listing_title?.split(' ').slice(0, 3).join(' ') || 'Location'}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-sm">
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <Calendar size={14} className="mr-1.5 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                          <span>
                            {format(new Date(booking.check_in), 'MMM d, yyyy')} — {format(new Date(booking.check_out), 'MMM d, yyyy')}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <Users size={14} className="mr-1.5 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                          <span>{booking.guest_count} {booking.guest_count === 1 ? 'guest' : 'guests'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Total</span>
                        <span className="ml-2 font-semibold text-gray-900 dark:text-white text-lg">
                          {formatPrice(booking.total_price)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {isCompleted && (
                          <button
                            onClick={() => handleLeaveReview(booking)}
                            className="flex items-center gap-1.5 text-[#FF385C] text-sm font-medium hover:underline"
                          >
                            <Edit3 size={14} />
                            Leave Review
                          </button>
                        )}
                        <Link href={`/listings/${booking.listing_id}`} className="flex items-center text-[#FF385C] text-sm font-medium">
                          View details
                          <ChevronRight size={16} className="ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl max-w-md w-full mx-4 p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Leave a Review</h2>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
              >
                <X size={24} />
              </button>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              How was your stay at <span className="font-medium text-gray-900 dark:text-white">{selectedBooking.listing_title}</span>?
            </p>

            {/* Star Rating */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="text-3xl transition hover:scale-110"
                  >
                    <Star
                      size={32}
                      className={`${
                        star <= rating
                          ? 'fill-[#FF385C] text-[#FF385C]'
                          : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'
                      } transition`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent!'}
              </p>
            </div>

            {/* Review Text */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Review
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience..."
                className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF385C] transition resize-none bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-white"
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="flex-1 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={submitting}
                className="flex-1 py-2 bg-[#FF385C] text-white rounded-lg hover:bg-[#D70466] transition font-medium disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
