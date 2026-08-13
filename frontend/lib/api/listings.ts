import { apiClient } from './client';
import { Listing } from '../types';

export const listingsApi = {
  getAll: async (params?: any): Promise<Listing[]> => {
    // Build query string
    const queryParams = new URLSearchParams();
    if (params?.location) {
      queryParams.append('location', params.location);
    }
    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params?.offset) {
      queryParams.append('offset', params.offset.toString());
    }
    if (params?.min_price) {
      queryParams.append('min_price', params.min_price.toString());
    }
    if (params?.max_price) {
      queryParams.append('max_price', params.max_price.toString());
    }
    if (params?.property_type) {
      queryParams.append('property_type', params.property_type);
    }
    if (params?.min_rating) {
      queryParams.append('min_rating', params.min_rating.toString());
    }
    
    const url = `/listings/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiClient.get(url);
    return response.data;
  },

  getById: async (id: number): Promise<Listing> => {
    const response = await apiClient.get(`/listings/${id}/`);
    return response.data;
  },

  create: async (data: Partial<Listing>, hostId: number): Promise<Listing> => {
    const response = await apiClient.post('/listings/', data, {
      params: { host_id: hostId },
    });
    return response.data;
  },

  update: async (id: number, data: Partial<Listing>, hostId: number): Promise<Listing> => {
    const response = await apiClient.put(`/listings/${id}/`, data, {
      params: { host_id: hostId },
    });
    return response.data;
  },

  delete: async (id: number, hostId: number): Promise<void> => {
    await apiClient.delete(`/listings/${id}/`, {
      params: { host_id: hostId },
    });
  },
};
