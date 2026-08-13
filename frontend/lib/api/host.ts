import { apiClient } from './client';
import { Listing, Booking } from '../types';

export const hostApi = {
  getHostListings: async (hostId: number): Promise<Listing[]> => {
    const response = await apiClient.get('/host/listings', {
      params: { host_id: hostId },
    });
    return response.data;
  },

  getHostBookings: async (hostId: number, status?: string): Promise<Booking[]> => {
    const response = await apiClient.get('/host/bookings', {
      params: { host_id: hostId, status },
    });
    return response.data;
  },

  getDashboard: async (hostId: number) => {
    const response = await apiClient.get('/host/dashboard', {
      params: { host_id: hostId },
    });
    return response.data;
  },
};
