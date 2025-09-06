import { NextRequest } from 'next/server';
import { z } from 'zod';
import { ApiErrors } from './response';

/**
 * Validate request body against a Zod schema
 */
export async function validateBody<T extends z.ZodType>(
  request: NextRequest,
  schema: T
): Promise<{ success: true; data: z.infer<T> } | { success: false; error: ReturnType<typeof ApiErrors.validationError> }> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);
    
    if (!result.success) {
      return {
        success: false,
        error: ApiErrors.validationError(result.error.format()),
      };
    }
    
    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      error: ApiErrors.badRequest('Invalid JSON in request body'),
    };
  }
}

/**
 * Validate query parameters against a Zod schema
 */
export function validateQuery<T extends z.ZodType>(
  request: NextRequest,
  schema: T
): { success: true; data: z.infer<T> } | { success: false; error: ReturnType<typeof ApiErrors.validationError> } {
  try {
    const url = new URL(request.url);
    const queryParams: Record<string, string> = {};
    
    url.searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });
    
    const result = schema.safeParse(queryParams);
    
    if (!result.success) {
      return {
        success: false,
        error: ApiErrors.validationError(result.error.format()),
      };
    }
    
    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      error: ApiErrors.badRequest('Invalid query parameters'),
    };
  }
}