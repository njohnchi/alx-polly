import { z } from 'zod';

// This is the main schema used by the form components
export const pollFormSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }).max(100, { message: 'Title must be less than 100 characters' }),
  description: z.string().max(500, { message: 'Description must be less than 500 characters' }).optional(),
  is_multiple_choice: z.boolean().default(false),
  is_public: z.boolean().default(true),
  end_date: z.date().optional(),
  options: z.array(
    z.object({
      text: z.string().min(1, { message: 'Option text is required' }).max(100, { message: 'Option text must be less than 100 characters' }),
    })
  ).min(2, { message: 'At least 2 options are required' }),
});

// Aliases for backward compatibility
export const createPollSchema = pollFormSchema;

export const updatePollSchema = createPollSchema.partial().extend({
  id: z.string().uuid(),
});

export type CreatePollInput = z.infer<typeof createPollSchema>;
export type UpdatePollInput = z.infer<typeof updatePollSchema>;