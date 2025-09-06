import { jest } from '@jest/globals';
import { PollRepository, PollOptionRepository, VoteRepository } from '@/lib/repositories/poll-repository';
import { RepositoryFactory } from '@/lib/repositories/repository-factory';

/**
 * Create a mock poll repository for testing
 */
export function createMockPollRepository() {
  const mockRepo = {
    findById: jest.fn().mockResolvedValue(null),
    findAll: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockResolvedValue(null),
    update: jest.fn().mockResolvedValue(null),
    delete: jest.fn().mockResolvedValue(true),
    findByIdWithOptions: jest.fn().mockResolvedValue(null),
    findAllWithOptions: jest.fn().mockResolvedValue([]),
    createWithOptions: jest.fn().mockResolvedValue({ poll: null, success: false }),
    getPollResults: jest.fn().mockResolvedValue({ results: [], totalVotes: 0 }),
  } as unknown as PollRepository;

  return mockRepo;
}

/**
 * Create a mock poll option repository for testing
 */
export function createMockPollOptionRepository() {
  const mockRepo = {
    findById: jest.fn().mockResolvedValue(null),
    findAll: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockResolvedValue(null),
    update: jest.fn().mockResolvedValue(null),
    delete: jest.fn().mockResolvedValue(true),
    findByPollId: jest.fn().mockResolvedValue([]),
    verifyOptionBelongsToPoll: jest.fn().mockResolvedValue(false),
  } as unknown as PollOptionRepository;

  return mockRepo;
}

/**
 * Create a mock vote repository for testing
 */
export function createMockVoteRepository() {
  const mockRepo = {
    findById: jest.fn().mockResolvedValue(null),
    findAll: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockResolvedValue(null),
    update: jest.fn().mockResolvedValue(null),
    delete: jest.fn().mockResolvedValue(true),
    findUserVote: jest.fn().mockResolvedValue(null),
    findAnonymousVote: jest.fn().mockResolvedValue(null),
    updateVote: jest.fn().mockResolvedValue(true),
  } as unknown as VoteRepository;

  return mockRepo;
}

/**
 * Create a mock repository factory for testing
 */
export function createMockRepositoryFactory() {
  const mockPollRepo = createMockPollRepository();
  const mockPollOptionRepo = createMockPollOptionRepository();
  const mockVoteRepo = createMockVoteRepository();

  const mockFactory = {
    getPollRepository: jest.fn().mockReturnValue(mockPollRepo),
    getPollOptionRepository: jest.fn().mockReturnValue(mockPollOptionRepo),
    getVoteRepository: jest.fn().mockReturnValue(mockVoteRepo),
  } as unknown as RepositoryFactory;

  return {
    factory: mockFactory,
    pollRepo: mockPollRepo,
    pollOptionRepo: mockPollOptionRepo,
    voteRepo: mockVoteRepo,
  };
}