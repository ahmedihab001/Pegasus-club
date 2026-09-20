// src/__tests__/pages/Schedule.test.jsx
import { render, screen } from '@testing-library/react';
import { ServiceContext } from '../../context/ServiceContext';
import Schedule from '../../pages/Schedule';
import { vi } from 'vitest';

// Mock services
const mockBookingService = {
  getUserBookings: vi.fn().mockResolvedValue([]),
  cancelBooking: vi.fn(),
};
const mockEventService = {
  getUserRegistrations: vi.fn().mockResolvedValue([]),
  cancelRegistration: vi.fn(),
};
const mockProgramService = {};
const mockAuthService = {};

const renderWithMockServices = () => {
  return render(
    <ServiceContext.Provider
      value={{
        bookingService: mockBookingService,
        eventService: mockEventService,
        programService: mockProgramService,
        authService: mockAuthService,
      }}
    >
      <Schedule />
    </ServiceContext.Provider>
  );
};

// Mock localStorage
const mockUser = { _id: '123', name: 'Test User' };
beforeEach(() => {
  localStorage.setItem('user', JSON.stringify(mockUser));
  vi.clearAllMocks();
});

test('displays "My Schedule" heading', async () => {
  renderWithMockServices();
  expect(await screen.findByText(/my schedule/i)).toBeInTheDocument();
});

test('calls getUserBookings and getUserRegistrations on load', async () => {
  renderWithMockServices();
  expect(mockBookingService.getUserBookings).toHaveBeenCalledWith('123');
  expect(mockEventService.getUserRegistrations).toHaveBeenCalledWith('123');
});