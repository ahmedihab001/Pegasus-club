// src/__tests__/services/BookingService.test.js
import { describe, it, expect, vi } from 'vitest';
import BookingService from '../../services/BookingService';

describe('BookingService', () => {
  const mockApi = {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
    put: vi.fn(),
  };

  it('getUserBookings calls API with correct URL', async () => {
    const service = new BookingService(mockApi);
    mockApi.get.mockResolvedValue([{ id: 1 }]);
    const result = await service.getUserBookings('123');
    expect(mockApi.get).toHaveBeenCalledWith('/bookings?userId=123');
    expect(result).toEqual([{ id: 1 }]);
  });

  it('createBooking sends POST request', async () => {
    const service = new BookingService(mockApi);
    const bookingData = { sportId: 's1', userId: 'u1' };
    mockApi.post.mockResolvedValue({ _id: 'new' });
    const result = await service.createBooking(bookingData);
    expect(mockApi.post).toHaveBeenCalledWith('/bookings', bookingData);
    expect(result).toEqual({ _id: 'new' });
  });
});