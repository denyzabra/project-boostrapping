import { NextRequest } from 'next/server';
import { withApiMiddleware, ApiContext } from '@/lib/api/middleware';
import { createSuccessResponse, ApiErrors } from '@/lib/api/response';
import { pollIdSchema } from '@/lib/api/schemas/poll-schemas';

export const GET = withApiMiddleware(async (request: NextRequest, context: ApiContext, { params }: { params: { id: string } }) => {
  // Validate poll ID
  const pollIdValidation = pollIdSchema.safeParse(params.id);
  if (!pollIdValidation.success) {
    return ApiErrors.badRequest('Invalid poll ID');
  }
  const pollId = pollIdValidation.data;
  
  // Get repositories
  const pollRepo = context.repositories.getPollRepository();
  
  // Get poll with options
  const poll = await pollRepo.findByIdWithOptions(pollId);
  
  if (!poll) {
    return ApiErrors.notFound('Poll not found');
  }
  
  return createSuccessResponse({ poll });
});