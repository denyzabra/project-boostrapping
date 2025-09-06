import { NextRequest } from 'next/server';
import { withApiMiddleware, ApiContext } from '@/lib/api/middleware';
import { validateBody } from '@/lib/api/validation';
import { createSuccessResponse, ApiErrors } from '@/lib/api/response';
import { voteSchema, pollIdSchema } from '@/lib/api/schemas/poll-schemas';

export const POST = withApiMiddleware(async (request: NextRequest, context: ApiContext, { params }: { params: { id: string } }) => {
  // Validate poll ID
  const pollIdValidation = pollIdSchema.safeParse(params.id);
  if (!pollIdValidation.success) {
    return ApiErrors.badRequest('Invalid poll ID');
  }
  const pollId = pollIdValidation.data;
  
  // Validate request body
  const validation = await validateBody(request, voteSchema);
  if (!validation.success) {
    return validation.error;
  }
  
  const { optionId } = validation.data;
  
  // Get repositories
  const pollOptionRepo = context.repositories.getPollOptionRepository();
  const voteRepo = context.repositories.getVoteRepository();
  
  // Verify the option belongs to the specified poll
  const isValidOption = await pollOptionRepo.verifyOptionBelongsToPoll(optionId, pollId);
  if (!isValidOption) {
    return ApiErrors.badRequest('Invalid poll option');
  }
  
  // Get client IP address for anonymous voting
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ipAddress = forwardedFor ? forwardedFor.split(',')[0] : '127.0.0.1';
  
  // Record vote (handles both new votes and updates)
  const { success, isUpdate } = await voteRepo.recordVote({
    pollId,
    optionId,
    userId: context.userId,
    ipAddress: context.userId ? undefined : ipAddress,
  });
  
  if (!success) {
    return ApiErrors.internalError('Failed to record vote');
  }
  
  return createSuccessResponse({
    message: isUpdate ? 'Vote updated successfully' : 'Vote recorded successfully',
  });
})

export const GET = withApiMiddleware(async (request: NextRequest, context: ApiContext, { params }: { params: { id: string } }) => {
  // Validate poll ID
  const pollIdValidation = pollIdSchema.safeParse(params.id);
  if (!pollIdValidation.success) {
    return ApiErrors.badRequest('Invalid poll ID');
  }
  const pollId = pollIdValidation.data;
  
  // Get repositories
  const pollRepo = context.repositories.getPollRepository();
  
  // Get poll with results
  const { poll, results } = await pollRepo.getPollWithResults(pollId);
  
  if (!poll) {
    return ApiErrors.notFound('Poll not found');
  }
  
  // Calculate total votes
  const totalVotes = results.reduce((sum: number, option) => sum + option.vote_count, 0);
  
  // Add percentage to each option
  const resultsWithPercentage = results.map((option) => ({
    ...option,
    percentage: totalVotes > 0 ? Math.round((option.vote_count / totalVotes) * 100) : 0,
  }));
  
  return createSuccessResponse({
    poll,
    results: resultsWithPercentage,
    totalVotes,
  });
})