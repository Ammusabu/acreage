import { apiClient } from './client';

export const reviewsApi = {
  createReview: async (data: { booking_id: number; rating: number; comment?: string }, reviewerId: number) => {
    const response = await apiClient.post('/reviews', data, {
      params: { reviewer_id: reviewerId },
    });
    return response.data;
  },

  getListingReviews: async (listingId: number) => {
    const response = await apiClient.get(`/reviews/listings/${listingId}`);
    return response.data;
  },
};
