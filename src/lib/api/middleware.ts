import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../supabase/client';
import { createRepositoryFactory } from '../repositories/repository-factory';
import { ApiErrors } from './response';

/**
 * Type for the context object passed to API handlers
 */
export interface ApiContext {
  params: Record<string, string>;
  repositories: ReturnType<typeof createRepositoryFactory>;
  session: any | null;
  userId: string | null;
}

/**
 * Type for API handler functions
 */
export type ApiHandler = (
  request: NextRequest,
  context: ApiContext
) => Promise<NextResponse>;

/**
 * Middleware options
 */
export interface MiddlewareOptions {
  requireAuth?: boolean;
}

/**
 * Middleware to handle common API logic
 */
export function withApiMiddleware(
  handler: ApiHandler,
  options: MiddlewareOptions = {}
) {
  return async (request: NextRequest, { params = {} }: { params?: Record<string, string> } = {}) => {
    try {
      // Create Supabase client
      const supabase = createServerSupabaseClient();
      
      // Create repositories
      const repositories = createRepositoryFactory(supabase);
      
      // Get session
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || null;
      
      // Check authentication if required
      if (options.requireAuth && !session) {
        return ApiErrors.unauthorized();
      }
      
      // Create context
      const context: ApiContext = {
        params,
        repositories,
        session,
        userId,
      };
      
      // Call handler
      return await handler(request, context);
    } catch (error) {
      console.error('API error:', error);
      return ApiErrors.internalError();
    }
  };
}

/**
 * Middleware to require authentication
 */
export function withAuth(handler: ApiHandler) {
  return withApiMiddleware(handler, { requireAuth: true });
}