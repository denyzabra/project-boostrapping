import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../supabase/database.types';
import { BaseRepository } from './base-repository';

// Define types for Poll entities
export type Poll = Database['public']['Tables']['polls']['Row'];
export type PollInsert = Database['public']['Tables']['polls']['Insert'];
export type PollUpdate = Database['public']['Tables']['polls']['Update'];

// Define types for PollOption entities
export type PollOption = Database['public']['Tables']['poll_options']['Row'];
export type PollOptionInsert = Database['public']['Tables']['poll_options']['Insert'];
export type PollOptionUpdate = Database['public']['Tables']['poll_options']['Update'];

// Define types for Vote entities
export type Vote = Database['public']['Tables']['votes']['Row'];
export type VoteInsert = Database['public']['Tables']['votes']['Insert'];
export type VoteUpdate = Database['public']['Tables']['votes']['Update'];

// Define types for poll results
export type PollResult = {
  option_id: string;
  option_text: string;
  vote_count: number;
  percentage?: number;
};

// Define a type for a poll with its options
export type PollWithOptions = Poll & {
  poll_options: PollOption[];
};

/**
 * Repository for poll-related operations
 */
export class PollRepository extends BaseRepository<Poll, PollInsert, PollUpdate> {
  constructor(client: SupabaseClient<Database>) {
    super(client, 'polls');
  }

  /**
   * Find a poll by ID with its options
   */
  async findByIdWithOptions(id: string): Promise<PollWithOptions | null> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select(`
        *,
        poll_options (*)
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('Error fetching poll with options:', error);
      return null;
    }

    return data as unknown as PollWithOptions;
  }

  /**
   * Find all polls with their options
   */
  async findAllWithOptions(isPublic?: boolean, userId?: string): Promise<PollWithOptions[]> {
    let query = this.client
      .from(this.tableName)
      .select(`
        *,
        poll_options (*)
      `);

    // Filter by user if userId is provided
    if (userId) {
      query = query.eq('created_by', userId);
    }

    // Only return public polls if isPublic is true
    if (isPublic) {
      query = query.eq('is_public', true);
    }

    // Order by created_at descending
    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching polls with options:', error);
      return [];
    }

    return (data as unknown as PollWithOptions[]) || [];
  }

  /**
   * Create a new poll with options
   */
  async createWithOptions(
    pollData: PollInsert,
    options: string[]
  ): Promise<{ poll: Poll | null; success: boolean }> {
    // Start a transaction
    const { data: poll, error: pollError } = await this.client
      .from('polls')
      .insert(pollData)
      .select('*')
      .single();

    if (pollError || !poll) {
      console.error('Error creating poll:', pollError);
      return { poll: null, success: false };
    }

    // Insert poll options
    const pollOptions = options.map((option: string, index: number) => ({
      poll_id: poll.id,
      text: option,
      position: index + 1,
    }));

    const { error: optionsError } = await this.client
      .from('poll_options')
      .insert(pollOptions);

    if (optionsError) {
      console.error('Error creating poll options:', optionsError);
      return { poll, success: false };
    }

    return { poll, success: true };
  }

  /**
   * Get poll results
   */
  async getPollResults(pollId: string): Promise<{ results: PollResult[]; totalVotes: number }> {
    // Get poll results using the custom function
    const { data, error } = await this.client
      .rpc('get_poll_results', { poll_uuid: pollId });

    if (error) {
      console.error('Error fetching poll results:', error);
      return { results: [], totalVotes: 0 };
    }

    const results = data as PollResult[];
    
    // Calculate total votes
    const totalVotes = results.reduce((sum, option) => sum + option.vote_count, 0);
    
    // Add percentage to each option
    const resultsWithPercentage = results.map(option => ({
      ...option,
      percentage: totalVotes > 0 ? Math.round((option.vote_count / totalVotes) * 100) : 0,
    }));

    return { results: resultsWithPercentage, totalVotes };
  }
}

/**
 * Repository for poll option operations
 */
export class PollOptionRepository extends BaseRepository<PollOption, PollOptionInsert, PollOptionUpdate> {
  constructor(client: SupabaseClient<Database>) {
    super(client, 'poll_options');
  }

  /**
   * Find options by poll ID
   */
  async findByPollId(pollId: string): Promise<PollOption[]> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select('*')
      .eq('poll_id', pollId)
      .order('position', { ascending: true });

    if (error) {
      console.error('Error fetching poll options:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Verify if an option belongs to a poll
   */
  async verifyOptionBelongsToPoll(optionId: string, pollId: string): Promise<boolean> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select('id')
      .eq('id', optionId)
      .eq('poll_id', pollId)
      .single();

    if (error || !data) {
      return false;
    }

    return true;
  }
}

/**
 * Repository for vote operations
 */
export class VoteRepository extends BaseRepository<Vote, VoteInsert, VoteUpdate> {
  constructor(client: SupabaseClient<Database>) {
    super(client, 'votes');
  }

  /**
   * Find a user's vote on a poll
   */
  async findUserVote(pollId: string, userId: string): Promise<Vote | null> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select('*')
      .eq('poll_id', pollId)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return data;
  }

  /**
   * Find an anonymous vote by IP address
   */
  async findAnonymousVote(pollId: string, ipAddress: string): Promise<Vote | null> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select('*')
      .eq('poll_id', pollId)
      .eq('ip_address', ipAddress)
      .is('user_id', null)
      .single();

    if (error || !data) {
      return null;
    }

    return data;
  }

  /**
   * Update a vote
   */
  async updateVote(voteId: string, optionId: string): Promise<boolean> {
    const { error } = await this.client
      .from(this.tableName)
      .update({ option_id: optionId })
      .eq('id', voteId);

    return !error;
  }
}