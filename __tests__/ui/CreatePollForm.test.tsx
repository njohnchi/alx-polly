import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreatePollForm from '@/components/polls/CreatePollForm';
import { createPoll } from '@/lib/actions/poll-actions';

// Mock the createPoll function
jest.mock('@/lib/actions/poll-actions', () => ({
  createPoll: jest.fn(),
}));

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('CreatePollForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock successful poll creation by default
    (createPoll as jest.Mock).mockResolvedValue({
      success: true,
      pollId: 'test-poll-id',
    });
  });

  test('renders the form with initial fields', () => {
    render(<CreatePollForm />);
    
    // Check for form elements
    expect(screen.getByText('Create a New Poll')).toBeInTheDocument();
    expect(screen.getByLabelText(/Poll Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Multiple Choice/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Public Poll/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/End Date/i)).toBeInTheDocument();
    
    // Check for initial options
    const optionInputs = screen.getAllByPlaceholderText(/Option \d/i);
    expect(optionInputs.length).toBe(2);
    
    // Check for submit button
    expect(screen.getByRole('button', { name: /Create Poll/i })).toBeInTheDocument();
  });

  test('allows adding and removing options', async () => {
    render(<CreatePollForm />);
    
    // Initially there should be 2 options
    let optionInputs = screen.getAllByPlaceholderText(/Option \d/i);
    expect(optionInputs.length).toBe(2);
    
    // Add an option
    const addButton = screen.getByRole('button', { name: /Add Option/i });
    await userEvent.click(addButton);
    
    // Now there should be 3 options
    optionInputs = screen.getAllByPlaceholderText(/Option \d/i);
    expect(optionInputs.length).toBe(3);
    
    // Remove the last option
    const removeButtons = screen.getAllByRole('button', { name: '' });
    await userEvent.click(removeButtons[2]); // Click the third remove button
    
    // Now there should be 2 options again
    optionInputs = screen.getAllByPlaceholderText(/Option \d/i);
    expect(optionInputs.length).toBe(2);
  });

  test('validates required fields on submission', async () => {
    render(<CreatePollForm />);
    
    // Submit the form without filling required fields
    const submitButton = screen.getByRole('button', { name: /Create Poll/i });
    await userEvent.click(submitButton);
    
    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/Title must be at least 3 characters/i)).toBeInTheDocument();
    });
  });

  test('submits the form with valid data', async () => {
    render(<CreatePollForm />);
    
    // Fill in the form
    await userEvent.type(screen.getByLabelText(/Poll Title/i), 'Test Poll');
    await userEvent.type(screen.getByLabelText(/Description/i), 'This is a test poll');
    
    // Fill in options
    const optionInputs = screen.getAllByPlaceholderText(/Option \d/i);
    await userEvent.type(optionInputs[0], 'Option 1');
    await userEvent.type(optionInputs[1], 'Option 2');
    
    // Toggle multiple choice
    const multipleChoiceSwitch = screen.getByLabelText(/Multiple Choice/i);
    await userEvent.click(multipleChoiceSwitch);
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Create Poll/i });
    await userEvent.click(submitButton);
    
    // Check if createPoll was called with correct data
    await waitFor(() => {
      expect(createPoll).toHaveBeenCalledWith({
        title: 'Test Poll',
        description: 'This is a test poll',
        is_multiple_choice: true,
        is_public: true,
        end_date: null,
        options: [
          { text: 'Option 1' },
          { text: 'Option 2' },
        ],
      });
    });
  });

  test('handles failed poll creation', async () => {
    // Mock failed poll creation
    (createPoll as jest.Mock).mockResolvedValue({
      success: false,
      error: 'Failed to create poll',
    });
    
    render(<CreatePollForm />);
    
    // Fill in the form with valid data
    await userEvent.type(screen.getByLabelText(/Poll Title/i), 'Test Poll');
    const optionInputs = screen.getAllByPlaceholderText(/Option \d/i);
    await userEvent.type(optionInputs[0], 'Option 1');
    await userEvent.type(optionInputs[1], 'Option 2');
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Create Poll/i });
    await userEvent.click(submitButton);
    
    // Check for error message
    await waitFor(() => {
      expect(screen.getByText('Failed to create poll')).toBeInTheDocument();
    });
  });
});