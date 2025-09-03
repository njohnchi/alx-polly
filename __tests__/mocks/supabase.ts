// Mock Supabase client for testing

export const mockSupabaseClient = {
  auth: {
    getUser: jest.fn(),
  },
  from: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  single: jest.fn(),
};

export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
};

export const mockPoll = {
  id: 'test-poll-id',
  title: 'Test Poll',
  description: 'Test Description',
  user_id: 'test-user-id',
  is_multiple_choice: false,
  is_public: true,
  end_date: null,
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z',
};

// Mock the createServerSupabaseClient function
export const mockCreateServerSupabaseClient = jest.fn().mockReturnValue(mockSupabaseClient);

// Setup mock responses
export const setupAuthUserMock = (success = true) => {
  if (success) {
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });
  } else {
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: { message: 'Not authenticated' },
    });
  }
};

export const setupPollInsertMock = (success = true) => {
  if (success) {
    mockSupabaseClient.single.mockResolvedValue({
      data: mockPoll,
      error: null,
    });
  } else {
    mockSupabaseClient.single.mockResolvedValue({
      data: null,
      error: { message: 'Failed to create poll' },
    });
  }
};

export const setupOptionsInsertMock = (success = true) => {
  if (success) {
    mockSupabaseClient.insert.mockResolvedValue({
      data: [{ id: 'option-1' }, { id: 'option-2' }],
      error: null,
    });
  } else {
    mockSupabaseClient.insert.mockResolvedValue({
      data: null,
      error: { message: 'Failed to create options' },
    });
  }
};