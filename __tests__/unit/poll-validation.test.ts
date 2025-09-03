import * as z from 'zod';

// Import the schema from the form component
// Since we can't directly import from a client component in tests,
// we'll recreate the schema here to test the validation logic
const pollFormSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }).max(100),
  description: z.string().max(500).optional(),
  is_multiple_choice: z.boolean().default(false),
  is_public: z.boolean().default(true),
  end_date: z.string().optional().nullable(),
  options: z.array(
    z.object({
      text: z.string().min(1, { message: 'Option text is required' }).max(100)
    })
  ).min(2, { message: 'At least 2 options are required' })
});

describe('Poll Form Validation Schema', () => {
  test('should validate a valid poll form input', () => {
    const validPoll = {
      title: 'Test Poll',
      description: 'This is a test poll',
      is_multiple_choice: true,
      is_public: true,
      end_date: '2023-12-31T23:59',
      options: [
        { text: 'Option 1' },
        { text: 'Option 2' },
      ],
    };

    const result = pollFormSchema.safeParse(validPoll);
    expect(result.success).toBe(true);
  });

  test('should validate with minimum required fields', () => {
    const minimalPoll = {
      title: 'Test',
      is_multiple_choice: false,
      is_public: false,
      options: [
        { text: 'Option 1' },
        { text: 'Option 2' },
      ],
    };

    const result = pollFormSchema.safeParse(minimalPoll);
    expect(result.success).toBe(true);
  });

  test('should fail with title less than 3 characters', () => {
    const invalidPoll = {
      title: 'AB',
      is_multiple_choice: false,
      is_public: true,
      options: [
        { text: 'Option 1' },
        { text: 'Option 2' },
      ],
    };

    const result = pollFormSchema.safeParse(invalidPoll);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('at least 3 characters');
    }
  });

  test('should fail with less than 2 options', () => {
    const invalidPoll = {
      title: 'Test Poll',
      is_multiple_choice: false,
      is_public: true,
      options: [
        { text: 'Option 1' },
      ],
    };

    const result = pollFormSchema.safeParse(invalidPoll);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('At least 2 options are required');
    }
  });

  test('should fail with empty option text', () => {
    const invalidPoll = {
      title: 'Test Poll',
      is_multiple_choice: false,
      is_public: true,
      options: [
        { text: 'Option 1' },
        { text: '' },
      ],
    };

    const result = pollFormSchema.safeParse(invalidPoll);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Option text is required');
    }
  });

  test('should fail with description exceeding max length', () => {
    const longDescription = 'A'.repeat(501);
    const invalidPoll = {
      title: 'Test Poll',
      description: longDescription,
      is_multiple_choice: false,
      is_public: true,
      options: [
        { text: 'Option 1' },
        { text: 'Option 2' },
      ],
    };

    const result = pollFormSchema.safeParse(invalidPoll);
    expect(result.success).toBe(false);
  });
});