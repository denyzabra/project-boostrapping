import { jest } from '@jest/globals';

/**
 * Create a mock Supabase client for testing
 */
export function createMockSupabaseClient() {
  const mockSupabase = {
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: { session: null },
        error: null,
      }),
      signInWithOAuth: jest.fn(),
      signOut: jest.fn(),
    },
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    neq: jest.fn().mockReturnThis(),
    gt: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lt: jest.fn().mockReturnThis(),
    lte: jest.fn().mockReturnThis(),
    is: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({
      data: null,
      error: null,
    }),
    rpc: jest.fn().mockReturnThis(),
  };

  // Allow methods to be chained
  mockSupabase.from.mockImplementation(() => mockSupabase);
  mockSupabase.select.mockImplementation(() => mockSupabase);
  mockSupabase.insert.mockImplementation(() => mockSupabase);
  mockSupabase.update.mockImplementation(() => mockSupabase);
  mockSupabase.delete.mockImplementation(() => mockSupabase);
  mockSupabase.eq.mockImplementation(() => mockSupabase);
  mockSupabase.neq.mockImplementation(() => mockSupabase);
  mockSupabase.gt.mockImplementation(() => mockSupabase);
  mockSupabase.gte.mockImplementation(() => mockSupabase);
  mockSupabase.lt.mockImplementation(() => mockSupabase);
  mockSupabase.lte.mockImplementation(() => mockSupabase);
  mockSupabase.is.mockImplementation(() => mockSupabase);
  mockSupabase.in.mockImplementation(() => mockSupabase);
  mockSupabase.order.mockImplementation(() => mockSupabase);
  mockSupabase.limit.mockImplementation(() => mockSupabase);
  mockSupabase.range.mockImplementation(() => mockSupabase);
  mockSupabase.rpc.mockImplementation(() => mockSupabase);

  return mockSupabase;
}

/**
 * Mock an authenticated user session
 */
export function mockAuthenticatedSession(mockSupabase: ReturnType<typeof createMockSupabaseClient>, userId: string = 'test-user-id') {
  mockSupabase.auth.getSession.mockResolvedValue({
    data: {
      session: {
        user: { id: userId, email: 'test@example.com' },
        access_token: 'mock-token',
      },
    },
    error: null,
  });
}

/**
 * Mock a successful database query result
 */
export function mockQueryResult<T>(mockSupabase: ReturnType<typeof createMockSupabaseClient>, data: T) {
  mockSupabase.single.mockResolvedValue({ data, error: null });
  return mockSupabase;
}

/**
 * Mock a database error
 */
export function mockQueryError(mockSupabase: ReturnType<typeof createMockSupabaseClient>, message: string = 'Database error') {
  mockSupabase.single.mockResolvedValue({ data: null, error: { message } });
  return mockSupabase;
}

/**
 * Mock a successful array result
 */
export function mockArrayResult<T>(mockSupabase: ReturnType<typeof createMockSupabaseClient>, data: T[]) {
  const mockPromise = Promise.resolve({ data, error: null });
  // Override the then method to make it thenable
  Object.defineProperty(mockSupabase, 'then', {
    value: (resolve: any) => mockPromise.then(resolve),
    writable: true,
  });
  return mockSupabase;
}

/**
 * Mock RPC result
 */
export function mockRpcResult<T>(mockSupabase: ReturnType<typeof createMockSupabaseClient>, data: T) {
  mockSupabase.rpc.mockImplementation(() => ({
    data,
    error: null,
  }));
  return mockSupabase;
}