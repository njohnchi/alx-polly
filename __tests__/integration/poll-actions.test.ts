import { createPoll } from '@/lib/actions/poll-actions';
import { CreatePollInput } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import * as supabaseMocks from '../mocks/supabase';

// Mock the createServerSupabaseClient function
jest.mock('@/lib/supabase', () => ({
  createServerSupabaseClient: () => supabaseMocks.mockCreateServerSupabaseClient(),
}));

// Mock next/cache
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('Poll Actions - createPoll', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should successfully create a poll with options', async () => {
    // Setup mocks
    supabaseMocks.setupAuthUserMock(true);
    supabaseMocks.setupPollInsertMock(true);
    supabaseMocks.setupOptionsInsertMock(true);

    // Create poll data
    const pollData: CreatePollInput = {
      title: 'Test Poll',
      description: 'This is a test poll',
      is_multiple_choice: false,
      is_public: true,
      options: [
        { text: 'Option 1' },
        { text: 'Option 2' },
      ],
    };

    // Call the createPoll function
    const result = await createPoll(pollData);

    // Assertions
    expect(result.success).toBe(true);
    expect(result.pollId).toBe(supabaseMocks.mockPoll.id);
    expect(supabaseMocks.mockSupabaseClient.auth.getUser).toHaveBeenCalled();
    expect(supabaseMocks.mockSupabaseClient.from).toHaveBeenCalledWith('polls');
    expect(supabaseMocks.mockSupabaseClient.from).toHaveBeenCalledWith('poll_options');
    expect(revalidatePath).toHaveBeenCalledWith('/polls');
  });

  test('should fail if user is not authenticated', async () => {
    // Setup mocks for unauthenticated user
    supabaseMocks.setupAuthUserMock(false);

    // Create poll data
    const pollData: CreatePollInput = {
      title: 'Test Poll',
      description: 'This is a test poll',
      is_multiple_choice: false,
      is_public: true,
      options: [
        { text: 'Option 1' },
        { text: 'Option 2' },
      ],
    };

    // Call the createPoll function
    const result = await createPoll(pollData);

    // Assertions
    expect(result.success).toBe(false);
    expect(result.error).toContain('You must be logged in');
    expect(supabaseMocks.mockSupabaseClient.from).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  test('should fail if poll insertion fails', async () => {
    // Setup mocks
    supabaseMocks.setupAuthUserMock(true);
    supabaseMocks.setupPollInsertMock(false);

    // Create poll data
    const pollData: CreatePollInput = {
      title: 'Test Poll',
      description: 'This is a test poll',
      is_multiple_choice: false,
      is_public: true,
      options: [
        { text: 'Option 1' },
        { text: 'Option 2' },
      ],
    };

    // Call the createPoll function
    const result = await createPoll(pollData);

    // Assertions
    expect(result.success).toBe(false);
    expect(result.error).toContain('Failed to create poll');
    expect(supabaseMocks.mockSupabaseClient.auth.getUser).toHaveBeenCalled();
    expect(supabaseMocks.mockSupabaseClient.from).toHaveBeenCalledWith('polls');
    expect(supabaseMocks.mockSupabaseClient.from).not.toHaveBeenCalledWith('poll_options');
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  test('should fail if options insertion fails', async () => {
    // Setup mocks
    supabaseMocks.setupAuthUserMock(true);
    supabaseMocks.setupPollInsertMock(true);
    supabaseMocks.setupOptionsInsertMock(false);

    // Create poll data
    const pollData: CreatePollInput = {
      title: 'Test Poll',
      description: 'This is a test poll',
      is_multiple_choice: false,
      is_public: true,
      options: [
        { text: 'Option 1' },
        { text: 'Option 2' },
      ],
    };

    // Call the createPoll function
    const result = await createPoll(pollData);

    // Assertions
    expect(result.success).toBe(false);
    expect(result.error).toContain('Failed to create poll options');
    expect(supabaseMocks.mockSupabaseClient.auth.getUser).toHaveBeenCalled();
    expect(supabaseMocks.mockSupabaseClient.from).toHaveBeenCalledWith('polls');
    expect(supabaseMocks.mockSupabaseClient.from).toHaveBeenCalledWith('poll_options');
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});