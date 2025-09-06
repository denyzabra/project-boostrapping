// Mock Next.js modules
jest.mock('next/server', () => {
  return {
    NextRequest: class NextRequest {
      constructor(url, options = {}) {
        this.url = url;
        this.method = options.method || 'GET';
        this.headers = new Headers(options.headers || {});
        this.body = options.body;
        this.nextUrl = new URL(url);
      }
    },
    NextResponse: {
      json: (body, options = {}) => {
        return {
          status: options.status || 200,
          json: async () => body,
        };
      },
    },
  };
});