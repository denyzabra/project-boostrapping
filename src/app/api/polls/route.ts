import { NextRequest } from 'next/server';
import { withAuth, withApiMiddleware, ApiContext } from '@/lib/api/middleware';
import { createPollSchema, pollQuerySchema } from '@/lib/api/schemas/poll-schemas';
import { validateBody, validateQuery } from '@/lib/api/validation';
import { createSuccessResponse, ApiErrors } from '@/lib/api/response';

export const POST = withAuth(async (request: NextRequest, context: ApiContext) => {
  // Validate request body
  const validation = await validateBody(request, createPollSchema);
  if (!validation.success) {
    return validation.error;
  }
  
  const { title, description, options, isPublic = true } = validation.data;
  
  // Create poll with options
  const pollRepo = context.repositories.getPollRepository();
  const { poll, success } = await pollRepo.createWithOptions(
    {
      title,
      description,
      created_by: context.userId,
      is_public: isPublic,
    },
    options
  );
  
  if (!success || !poll) {
    return ApiErrors.internalError('Failed to create poll');
  }
  
  return createSuccessResponse(
    {
      pollId: poll.id,
      message: 'Poll created successfully',
    },
    undefined,
    201
  );
});

export const GET = withApiMiddleware(async (request: NextRequest, context: ApiContext) => {
  // Validate query parameters
  const url = new URL(request.url);
  const validation = validateQuery(url.searchParams, pollQuerySchema);
  if (!validation.success) {
    return validation.error;
  }
  
  const { limit = 10, offset = 0, userId } = validation.data;
  
  // Get polls with options
  const pollRepo = context.repositories.getPollRepository();
  const polls = await pollRepo.findAllWithOptions({
    limit,
    offset,
    filters: userId ? { created_by: userId } : { is_public: true },
  });
  
  return createSuccessResponse({ polls });
});