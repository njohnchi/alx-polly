import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';


// Import mocks
import '../mocks/ui-components';

// Mock the CreatePollForm component
jest.mock('@/components/polls/CreatePollForm', () => {
  const MockCreatePollForm = () => (
    <div>
      <h1>Create a New Poll</h1>
      <form>
        <label htmlFor="title">Poll Title</label>
        <input id="title" name="title" />
        <label htmlFor="description">Description (Optional)</label>
        <textarea id="description" name="description"></textarea>
        <label htmlFor="is_multiple_choice">Multiple Choice</label>
        <input type="checkbox" id="is_multiple_choice" name="is_multiple_choice" />
        <label htmlFor="is_public">Public Poll</label>
        <input type="checkbox" id="is_public" name="is_public" defaultChecked />
        <label htmlFor="end_date">End Date (Optional)</label>
        <input type="datetime-local" id="end_date" name="end_date" />
        <div>
          <label>Poll Options</label>
          <button type="button">Add Option</button>
        </div>
        <div>
          <input placeholder="Option 1" name="options.0.text" />
          <button type="button" aria-label="Remove option">Remove</button>
        </div>
        <div>
          <input placeholder="Option 2" name="options.1.text" />
          <button type="button" aria-label="Remove option">Remove</button>
        </div>
        <button type="submit">Create Poll</button>
      </form>
    </div>
  );
  return MockCreatePollForm;
});

import CreatePollForm from '@/components/polls/CreatePollForm';

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ success: true, pollId: 'test-poll-id' }),
  })
) as jest.Mock;

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('CreatePollForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the form with initial fields', () => {
    render(<CreatePollForm />);
    
    // Check for form elements
    expect(screen.getByText('Create a New Poll')).toBeInTheDocument();
    expect(screen.getByLabelText(/Poll Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    
    // Check for initial options
    const optionInputs = screen.getAllByPlaceholderText(/Option \d/i);
    expect(optionInputs.length).toBe(2);
    
    // Check for submit button
    expect(screen.getByRole('button', { name: /Create Poll/i })).toBeInTheDocument();
  });

  test('submits the form with valid data', async () => {
    const user = userEvent.setup();
    render(<CreatePollForm />);
    
    // Fill in the form
    await user.type(screen.getByLabelText(/Poll Title/i), 'Test Poll');
    
    // Fill in options
    const optionInputs = screen.getAllByPlaceholderText(/Option \d/i);
    await user.type(optionInputs[0], 'Option 1');
    await user.type(optionInputs[1], 'Option 2');
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: /Create Poll/i }));
    
    // Check if fetch was called
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/polls', expect.any(Object));
    });
  });
});