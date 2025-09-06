import { NextRequest } from 'next/server';
import { POST, GET } from '@/app/api/polls/[id]/vote/route';

// Mock Supabase client
jest.mock('@/lib/supabase/client', () => {
  const mockSupabase = {
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: { session: { user: { id: 'mock-user-id' } } }
      }),
    },
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({
      data: null,
      error: null,
    }),
    insert: jest.fn().mockReturnThis(),
    rpc: jest.fn().mockReturnThis(),
    data: { id: 'mock-vote-id' },
    error: null,
  };
  
  // Allow methods to be chained
  mockSupabase.from.mockImplementation(() => mockSupabase);
  mockSupabase.select.mockImplementation(() => mockSupabase);
  mockSupabase.eq.mockImplementation(() => mockSupabase);
  mockSupabase.single.mockImplementation(() => Promise.resolve({
    data: { id: 'mock-vote-id' },
    error: null,
  }));
  mockSupabase.insert.mockImplementation(() => mockSupabase);
  mockSupabase.rpc.mockImplementation(() => mockSupabase);
  
  return {
    createServerSupabaseClient: jest.fn(() => mockSupabase),
  };
});

describe('POST /api/polls/[id]/vote', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if option_id is missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/polls/poll-id/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    const { params } = { params: { id: 'poll-id' } };
    const response = await POST(request, { params });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Option ID is required');
  });

  it('should create a vote for authenticated user', async () => {
    // Mock getSession to return a valid session
    const mockSupabase = require('@/lib/supabase/client').createServerSupabaseClient();
    mockSupabase.auth.getSession.mockResolvedValue({
      data: {
        session: {
          user: { id: 'mock-user-id' },
        },
      },
    });

    // Mock Supabase query to check for existing vote
    const mockSelect = jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(() => ({
          data: null,
          error: null,
        })),
      })),
    }));
    mockSupabase.from.mockReturnValue({ select: mockSelect });

    // Mock Supabase insert
    const mockInsert = jest.fn(() => ({
      select: jest.fn(() => ({
        single: jest.fn(() => ({
          data: { id: 'mock-vote-id' },
          error: null,
        })),
      })),
    }));
    mockSupabase.from.mockReturnValue({ select: mockSelect, insert: mockInsert });

    const request = new NextRequest('http://localhost:3000/api/polls/poll-id/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ option_id: 'option-id' }),
    });

    const { params } = { params: { id: 'poll-id' } };
    const response = await POST(request, { params });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
  });
});

describe('GET /api/polls/[id]/vote', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return poll results', async () => {
    // Mock Supabase rpc call
    const mockSupabase = require('@/lib/supabase/client').createServerSupabaseClient();
    const mockRpc = jest.fn(() => ({
      eq: jest.fn(() => ({
        data: [
          { option_id: 'option-1', text: 'Option 1', vote_count: 5 },
          { option_id: 'option-2', text: 'Option 2', vote_count: 3 },
        ],
        error: null,
      })),
    }));
    mockSupabase.from.mockReturnValue({ rpc: mockRpc });

    const request = new NextRequest('http://localhost:3000/api/polls/poll-id/vote');

    const { params } = { params: { id: 'poll-id' } };
    const response = await GET(request, { params });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.results).toHaveLength(2);
    expect(data.results[0].option_id).toBe('option-1');
    expect(data.results[0].vote_count).toBe(5);
    expect(data.results[1].option_id).toBe('option-2');
    expect(data.results[1].vote_count).toBe(3);
    expect(data.total_votes).toBe(8);
  });
});