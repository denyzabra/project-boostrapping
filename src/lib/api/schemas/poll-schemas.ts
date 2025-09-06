import { z } from 'zod';

/**
 * Schema for creating a poll
 */
export const createPollSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(255, 'Title must be less than 255 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional().nullable(),
  options: z.array(z.string().min(1, 'Option cannot be empty').max(255, 'Option must be less than 255 characters'))
    .min(2, 'At least 2 options are required')
    .max(10, 'Maximum 10 options allowed'),
  isPublic: z.boolean().default(true).optional(),
});

/**
 * Schema for poll query parameters
 */
export const pollQuerySchema = z.object({
  userId: z.string().uuid('Invalid user ID format').optional(),
  mine: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
});

/**
 * Schema for voting on a poll
 */
export const voteSchema = z.object({
  optionId: z.string().uuid('Invalid option ID format'),
});

/**
 * Schema for poll ID parameter
 */
export const pollIdSchema = z.object({
  id: z.string().uuid('Invalid poll ID format'),
});