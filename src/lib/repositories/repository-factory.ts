import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../supabase/database.types';
import { PollRepository, PollOptionRepository, VoteRepository } from './poll-repository';

/**
 * Factory class to create and provide access to all repositories
 * This ensures consistent client usage across repositories
 */
export class RepositoryFactory {
  private client: SupabaseClient<Database>;
  private pollRepository: PollRepository | null = null;
  private pollOptionRepository: PollOptionRepository | null = null;
  private voteRepository: VoteRepository | null = null;

  constructor(client: SupabaseClient<Database>) {
    this.client = client;
  }

  /**
   * Get the poll repository instance
   */
  getPollRepository(): PollRepository {
    if (!this.pollRepository) {
      this.pollRepository = new PollRepository(this.client);
    }
    return this.pollRepository;
  }

  /**
   * Get the poll option repository instance
   */
  getPollOptionRepository(): PollOptionRepository {
    if (!this.pollOptionRepository) {
      this.pollOptionRepository = new PollOptionRepository(this.client);
    }
    return this.pollOptionRepository;
  }

  /**
   * Get the vote repository instance
   */
  getVoteRepository(): VoteRepository {
    if (!this.voteRepository) {
      this.voteRepository = new VoteRepository(this.client);
    }
    return this.voteRepository;
  }
}

/**
 * Create a repository factory with the provided Supabase client
 */
export function createRepositoryFactory(client: SupabaseClient<Database>): RepositoryFactory {
  return new RepositoryFactory(client);
}