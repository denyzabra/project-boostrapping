import { NextRequest } from 'next/server';

/**
 * Create a mock NextRequest for testing
 */
export function createMockRequest({
  method = 'GET',
  url = 'http://localhost:3000',
  headers = {},
  body = null,
}: {
  method?: string;
  url?: string;
  headers?: Record<string, string>;
  body?: any;
} = {}) {
  const headersObj = new Headers();
  Object.entries(headers).forEach(([key, value]) => {
    headersObj.append(key, value);
  });

  const init: RequestInit = {
    method,
    headers: headersObj,
  };

  if (body) {
    init.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  const request = new NextRequest(url, init);

  // Mock the json method
  request.json = jest.fn().mockResolvedValue(body);

  return request;
}

/**
 * Create mock params for route handlers
 */
export function createMockParams(params: Record<string, string> = {}) {
  return { params };
}