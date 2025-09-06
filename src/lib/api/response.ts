import { NextResponse } from 'next/server';

/**
 * Standard API response structure
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    [key: string]: any;
  };
}

/**
 * Create a successful API response
 */
export function createSuccessResponse<T>(
  data: T,
  meta?: ApiResponse['meta'],
  status: number = 200
): NextResponse {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };

  if (meta) {
    response.meta = meta;
  }

  return NextResponse.json(response, { status });
}

/**
 * Create an error API response
 */
export function createErrorResponse(
  message: string,
  status: number = 500,
  code?: string,
  details?: any
): NextResponse {
  const response: ApiResponse = {
    success: false,
    error: {
      message,
      ...(code && { code }),
      ...(details && { details }),
    },
  };

  return NextResponse.json(response, { status });
}

/**
 * Common error responses
 */
export const ApiErrors = {
  unauthorized: () => createErrorResponse('Unauthorized', 401, 'UNAUTHORIZED'),
  forbidden: () => createErrorResponse('Forbidden', 403, 'FORBIDDEN'),
  notFound: (resource: string = 'Resource') => 
    createErrorResponse(`${resource} not found`, 404, 'NOT_FOUND'),
  badRequest: (message: string = 'Invalid request data') => 
    createErrorResponse(message, 400, 'BAD_REQUEST'),
  internalError: (message: string = 'Internal server error') => 
    createErrorResponse(message, 500, 'INTERNAL_ERROR'),
  validationError: (details: any) => 
    createErrorResponse('Validation error', 400, 'VALIDATION_ERROR', details),
};