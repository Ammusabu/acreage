import { apiClient } from './client';
import { Listing } from '../types';

export const favoritesApi = {
  toggleFavorite: async (listingId: number, userId: number) => {
    const response = await apiClient.post('/favorites/toggle', null, {
      params: { listing_id: listingId, user_id: userId },
    });
    return response.data;
  },

  getFavorites: async (userId: number): Promise<Listing[]> => {
    const response = await apiClient.get('/favorites', {
      params: { user_id: userId },
    });
    return response.data;
  },

  checkFavorite: async (listingId: number, userId: number) => {
    const response = await apiClient.get('/favorites/check', {
      params: { listing_id: listingId, user_id: userId },
    });
    return response.data;
  },
};
