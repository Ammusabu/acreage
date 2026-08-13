import { apiClient } from './client';
import { Booking } from '../types';

export const bookingsApi = {
  create: async (data: {
    listing_id: number;
    check_in: string;
    check_out: string;
    guest_count: number;
  }, guestId: number): Promise<Booking> => {
    const response = await apiClient.post('/bookings', data, {
      params: { guest_id: guestId },
    });
    return response.data;
  },

  getUserBookings: async (userId: number): Promise<Booking[]> => {
    const response = await apiClient.get('/bookings', {
      params: { user_id: userId },
    });
    return response.data;
  },

  checkAvailability: async (listingId: number, checkIn: string, checkOut: string) => {
    const response = await apiClient.get(`/bookings/listings/${listingId}/availability`, {
      params: { check_in: checkIn, check_out: checkOut },
    });
    return response.data;
  },

  cancel: async (bookingId: number, userId: number): Promise<void> => {
    await apiClient.put(`/bookings/${bookingId}/cancel`, null, {
      params: { user_id: userId },
    });
  },
};
