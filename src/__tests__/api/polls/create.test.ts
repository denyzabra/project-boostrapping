import { NextRequest } from 'next/server';
import { POST } from '@/app/api/polls/route';

// Mock Supabase client
jest.mock('@/lib/supabase/client', () => {
  const mockSupabase = {
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: { session: { user: { id: 'mock-user-id' } } }
      }),
    },
    from: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({
      data: { id: 'mock-poll-id' },
      error: null,
    }),
  };
  
  // Allow methods to be chained
  mockSupabase.from.mockImplementation(() => mockSupabase);
  mockSupabase.insert.mockImplementation(() => mockSupabase);
  mockSupabase.select.mockImplementation(() => mockSupabase);
  
  return {
    createServerSupabaseClient: jest.fn(() => mockSupabase),
  };
});

describe('POST /api/polls', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it('should return 401 if user is not authenticated', async () => {
    // Mock getSession to return null (unauthenticated)
    const mockSupabase = require('@/lib/supabase/client').createServerSupabaseClient();
    mockSupabase.auth.getSession.mockResolvedValue({ data: { session: null } });

    const request = new NextRequest('http://localhost:3000/api/polls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Test Poll',
        options: ['Option 1', 'Option 2'],
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe('Unauthorized');
  });

  it('should return 400 if title is missing', async () => {
    // Mock getSession to return a valid session
    const mockSupabase = require('@/lib/supabase/client').createServerSupabaseClient();
    mockSupabase.auth.getSession.mockResolvedValue({
      data: {
        session: {
          user: { id: 'mock-user-id' },
        },
      },
    });

    const request = new NextRequest('http://localhost:3000/api/polls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        options: ['Option 1', 'Option 2'],
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Title is required');
  });

  it('should return 400 if less than 2 options are provided', async () => {
    // Mock getSession to return a valid session
    const mockSupabase = require('@/lib/supabase/client').createServerSupabaseClient();
    mockSupabase.auth.getSession.mockResolvedValue({
      data: {
        session: {
          user: { id: 'mock-user-id' },
        },
      },
    });

    const request = new NextRequest('http://localhost:3000/api/polls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Test Poll',
        options: ['Option 1'],
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('At least 2 options are required');
  });

  it('should create a poll successfully', async () => {
    // Mock getSession to return a valid session
    const mockSupabase = require('@/lib/supabase/client').createServerSupabaseClient();
    mockSupabase.auth.getSession.mockResolvedValue({
      data: {
        session: {
          user: { id: 'mock-user-id' },
        },
      },
    });

    // Mock Supabase insert to return success
    const mockInsert = jest.fn(() => ({
      select: jest.fn(() => ({
        single: jest.fn(() => ({
          data: { id: 'mock-poll-id' },
          error: null,
        })),
      })),
    }));
    mockSupabase.from.mockReturnValue({ insert: mockInsert });

    const request = new NextRequest('http://localhost:3000/api/polls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Test Poll',
        description: 'Test Description',
        options: ['Option 1', 'Option 2'],
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.pollId).toBe('mock-poll-id');
  });
});