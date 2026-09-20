const BookingService = require('../../services/BookingService');

describe('BookingService', () => {
  let bookingService;
  let mockRepo;

  beforeEach(() => {
    mockRepo = {
      create: jest.fn(),
      findOne: jest.fn(),
      countDocuments: jest.fn(),
      findByUserId: jest.fn(),
      findByIdAndDelete: jest.fn(),
      findByIdAndUpdate: jest.fn(),
    };
    bookingService = new BookingService(mockRepo);
  });

  test('should create booking when no duplicate', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    mockRepo.create.mockResolvedValue({ _id: '123', userId: 'user1', sportName: 'Football' });

    const result = await bookingService.createBooking({
      userId: 'user1',
      sportId: 'sport1',
      sportName: 'Football',
      coach: 'John',
      day: 'Monday',
      time: '5PM',
      price: 50,
    });

    expect(mockRepo.findOne).toHaveBeenCalled();
    expect(mockRepo.create).toHaveBeenCalled();
    expect(result._id).toBe('123');
  });

  test('should throw duplicate error when booking already exists', async () => {
    mockRepo.findOne.mockResolvedValue({ _id: 'existing' });

    await expect(bookingService.createBooking({
      userId: 'user1',
      sportId: 'sport1',
      sportName: 'Football',
      coach: 'John',
      day: 'Monday',
      time: '5PM',
    })).rejects.toThrow('already have a booking');
  });

  test('should throw error when required fields are missing', async () => {
    await expect(bookingService.createBooking({
      userId: 'user1',
      sportId: 'sport1',
      // missing sportName, coach, day, time
    })).rejects.toThrow('Missing required fields');
  });
});