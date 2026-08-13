'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Plus, Edit, Trash2, Calendar, DollarSign, Users, Star, Eye, ChevronRight } from 'lucide-react';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { hostApi } from '@/lib/api/host';
import { listingsApi } from '@/lib/api/listings';
import { Listing } from '@/lib/types';
import toast from 'react-hot-toast';

export default function HostDashboard() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'listings' | 'bookings'>('listings');

  const hostId = 1;

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [listingsData, dashboard] = await Promise.all([
          hostApi.getHostListings(hostId),
          hostApi.getDashboard(hostId),
        ]);
        setListings(listingsData);
        setDashboardData(dashboard);
      } catch (error) {
        console.error('Failed to fetch dashboard:', error);
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleDeleteListing = async (listingId: number) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    try {
      await listingsApi.delete(listingId, hostId);
      setListings(listings.filter((l) => l.id !== listingId));
      toast.success('Listing deleted successfully');
    } catch (error) {
      toast.error('Failed to delete listing');
    }
  };

  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(0)}`;
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container-acreage py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      
      <div className="container-acreage py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#172033]">Host Dashboard</h1>
          <Link
            href="/host/create"
            className="bg-[#FF385C] text-white px-4 py-2 rounded-lg hover:bg-[#D70466] transition flex items-center space-x-2 text-sm"
          >
            <Plus size={18} />
            <span>Add Listing</span>
          </Link>
        </div>

        {/* Stats Cards */}
        {dashboardData && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-sm">
              <p className="text-sm text-[#667085]">Total Listings</p>
              <p className="text-2xl font-bold text-[#172033]">{dashboardData.total_listings}</p>
            </div>
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-sm">
              <p className="text-sm text-[#667085]">Total Bookings</p>
              <p className="text-2xl font-bold text-[#172033]">{dashboardData.total_bookings}</p>
            </div>
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-sm">
              <p className="text-sm text-[#667085]">Total Revenue</p>
              <p className="text-2xl font-bold text-[#172033]">{formatPrice(dashboardData.total_revenue)}</p>
            </div>
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-sm">
              <p className="text-sm text-[#667085]">Pending</p>
              <p className="text-2xl font-bold text-[#172033]">{dashboardData.pending_bookings}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-6 border-b border-[#E5E7EB] mb-6">
          <button
            onClick={() => setActiveTab('listings')}
            className={`pb-3 px-1 font-medium transition ${
              activeTab === 'listings'
                ? 'border-b-2 border-[#FF385C] text-[#172033]'
                : 'text-[#667085] hover:text-[#172033]'
            }`}
          >
            My Listings ({listings.length})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 px-1 font-medium transition ${
              activeTab === 'bookings'
                ? 'border-b-2 border-[#FF385C] text-[#172033]'
                : 'text-[#667085] hover:text-[#172033]'
            }`}
          >
            Bookings ({dashboardData?.total_bookings || 0})
          </button>
        </div>

        {/* Listings Tab */}
        {activeTab === 'listings' && (
          <div>
            {listings.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-[#E5E7EB]">
                <Home size={48} className="mx-auto text-[#98A2B3] mb-4" />
                <h2 className="text-xl font-medium text-[#667085]">No listings yet</h2>
                <p className="text-[#98A2B3] mt-2">Start hosting by creating your first listing!</p>
                <Link
                  href="/host/create"
                  className="inline-block mt-4 bg-[#FF385C] text-white px-6 py-2 rounded-lg hover:bg-[#D70466] transition"
                >
                  Create Listing
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <div key={listing.id} className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative aspect-video bg-[#F8FAFC]">
                      {listing.images && listing.images.length > 0 ? (
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#98A2B3]">
                          No image
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex space-x-2">
                        <Link
                          href={`/host/edit/${listing.id}`}
                          className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition"
                          aria-label="Edit listing"
                        >
                          <Edit size={16} className="text-[#667085]" />
                        </Link>
                        <button
                          onClick={() => handleDeleteListing(listing.id)}
                          className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition"
                          aria-label="Delete listing"
                        >
                          <Trash2 size={16} className="text-[#DC2626]" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-[#172033]">{listing.title}</h3>
                      <p className="text-sm text-[#667085]">{listing.location}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <Star size={14} className="fill-current text-[#172033]" />
                          <span className="text-sm text-[#172033]">{listing.rating.toFixed(1)}</span>
                          <span className="text-sm text-[#667085]">({listing.review_count} reviews)</span>
                        </div>
                        <span className="font-semibold text-[#172033]">{formatPrice(listing.price_per_night)}/night</span>
                      </div>
                      <div className="mt-3 pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          listing.is_active 
                            ? 'bg-green-50 text-green-700' 
                            : 'bg-red-50 text-red-700'
                        }`}>
                          {listing.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <Link
                          href={`/listings/${listing.id}`}
                          className="text-[#FF385C] hover:underline flex items-center space-x-1"
                        >
                          <Eye size={14} />
                          <span>View</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            {dashboardData?.recent_bookings?.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-[#E5E7EB]">
                <Calendar size={48} className="mx-auto text-[#98A2B3] mb-4" />
                <h2 className="text-xl font-medium text-[#667085]">No bookings yet</h2>
                <p className="text-[#98A2B3] mt-2">Bookings will appear here once guests start booking.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dashboardData?.recent_bookings?.map((booking: any) => (
                  <div key={booking.id} className="bg-white border border-[#E5E7EB] rounded-xl p-4 hover:shadow-md transition">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <div>
                        <h3 className="font-semibold text-[#172033]">{booking.listing_title}</h3>
                        <p className="text-sm text-[#667085]">Guest: {booking.guest_name}</p>
                        <div className="flex items-center space-x-4 text-sm text-[#667085] mt-1">
                          <span>
                            {new Date(booking.check_in).toLocaleDateString()} - {new Date(booking.check_out).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span className="font-semibold text-[#172033]">{formatPrice(booking.total_price)}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 mt-2 sm:mt-0">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'confirmed' ? 'badge-success' :
                          booking.status === 'pending' ? 'badge-warning' :
                          booking.status === 'cancelled' ? 'badge-danger' :
                          'badge-neutral'
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                        <ChevronRight size={16} className="text-[#98A2B3]" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
