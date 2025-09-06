import { NextRequest } from 'next/server';
import { GET } from '@/app/api/polls/route';

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
    order: jest.fn().mockReturnThis(),
    eq: jest.fn().mockResolvedValue({
      data: [
        {
          id: 'poll-1',
          title: 'Test Poll 1',
          created_at: '2023-01-01T00:00:00Z',
        },
        {
          id: 'poll-2',
          title: 'Test Poll 2',
          created_at: '2023-01-02T00:00:00Z',
        },
      ],
      error: null,
    }),
    or: jest.fn().mockResolvedValue({
      data: [
        {
          id: 'poll-1',
          title: 'Test Poll 1',
          created_at: '2023-01-01T00:00:00Z',
        },
        {
          id: 'poll-2',
          title: 'Test Poll 2',
          created_at: '2023-01-02T00:00:00Z',
        },
      ],
      error: null,
    }),
  };
  
  // Allow methods to be chained
  mockSupabase.from.mockImplementation(() => mockSupabase);
  mockSupabase.select.mockImplementation(() => mockSupabase);
  mockSupabase.order.mockImplementation(() => mockSupabase);
  
  return {
    createServerSupabaseClient: jest.fn(() => mockSupabase),
  };
});

describe('GET /api/polls', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return all public polls when no mine parameter is provided', async () => {
    // Mock getSession to return null (unauthenticated)
    const mockSupabase = require('@/lib/supabase/client').createServerSupabaseClient();
    mockSupabase.auth.getSession.mockResolvedValue({ data: { session: null } });

    // Mock Supabase query
    const mockSelect = jest.fn(() => ({
      order: jest.fn(() => ({
        eq: jest.fn(() => ({
          data: [
            {
              id: 'poll-1',
              title: 'Test Poll 1',
              created_at: '2023-01-01T00:00:00Z',
            },
            {
              id: 'poll-2',
              title: 'Test Poll 2',
              created_at: '2023-01-02T00:00:00Z',
            },
          ],
          error: null,
        })),
      })),
    }));
    mockSupabase.from.mockReturnValue({ select: mockSelect });

    const request = new NextRequest('http://localhost:3000/api/polls');

    const response = await GET(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.polls).toHaveLength(2);
    expect(data.polls[0].id).toBe('poll-1');
    expect(data.polls[1].id).toBe('poll-2');

    // Verify that the correct query was made
    expect(mockSupabase.from).toHaveBeenCalledWith('polls');
    expect(mockSelect().order).toHaveBeenCalledWith('created_at', { ascending: false });
    expect(mockSelect().order().eq).toHaveBeenCalledWith('is_public', true);
  });

  it('should return user polls when mine parameter is true and user is authenticated', async () => {
    // Mock getSession to return a valid session
    const mockSupabase = require('@/lib/supabase/client').createServerSupabaseClient();
    mockSupabase.auth.getSession.mockResolvedValue({
      data: {
        session: {
          user: { id: 'mock-user-id' },
        },
      },
    });

    // Mock Supabase query
    const mockSelect = jest.fn(() => ({
      order: jest.fn(() => ({
        eq: jest.fn(() => ({
          data: [
            {
              id: 'poll-3',
              title: 'My Poll',
              created_at: '2023-01-03T00:00:00Z',
            },
          ],
          error: null,
        })),
      })),
    }));
    mockSupabase.from.mockReturnValue({ select: mockSelect });

    const request = new NextRequest('http://localhost:3000/api/polls?mine=true');

    const response = await GET(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.polls).toHaveLength(1);
    expect(data.polls[0].id).toBe('poll-3');

    // Verify that the correct query was made
    expect(mockSupabase.from).toHaveBeenCalledWith('polls');
    expect(mockSelect().order).toHaveBeenCalledWith('created_at', { ascending: false });
    expect(mockSelect().order().eq).toHaveBeenCalledWith('created_by', 'mock-user-id');
  });

  it('should return 401 when mine parameter is true but user is not authenticated', async () => {
    // Mock getSession to return null (unauthenticated)
    const mockSupabase = require('@/lib/supabase/client').createServerSupabaseClient();
    mockSupabase.auth.getSession.mockResolvedValue({ data: { session: null } });

    const request = new NextRequest('http://localhost:3000/api/polls?mine=true');

    const response = await GET(request);
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe('Unauthorized');
  });
});