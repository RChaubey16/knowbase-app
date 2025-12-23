// Base fetcher configuration
interface FetcherOptions extends RequestInit {
  params?: Record<string, string>;
  skipRetry?: boolean; // Internal flag to prevent infinite retry loops
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

// Shared refresh promise to prevent multiple simultaneous refresh calls
let refreshPromise: Promise<void> | null = null;

// CLIENT-SIDE: Refresh tokens using browser's automatic cookie handling
async function refreshTokensClient() {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Refresh failed");
        }
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  console.log(`IN REFRESH (CLIENT)`);
  return refreshPromise;
}

// Shared base fetcher logic with retry on 401 (CLIENT ONLY)
async function baseFetcherWithRetry<T>(
  endpoint: string,
  options: FetcherOptions,
  refreshFn: () => Promise<void>
): Promise<T> {
  const { params, skipRetry, ...fetchOptions } = options;

  // Build URL with query parameters
  let url = endpoint;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url = `${endpoint}?${searchParams.toString()}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
  });

  // Handle 401 Unauthorized - attempt token refresh
  if (response.status === 401 && !skipRetry) {
    console.log('Received 401, attempting token refresh...');
    
    try {
      await refreshFn();
      
      // Retry the original request with skipRetry flag
      return baseFetcherWithRetry<T>(endpoint, { ...options, skipRetry: true }, refreshFn);
    } catch (refreshError) {
      console.error('Token refresh failed:', refreshError);
      throw new Error('Authentication failed');
    }
  }

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Simple fetcher for server (no retry logic)
async function baseFetcherServer<T>(
  endpoint: string,
  options: FetcherOptions
): Promise<T> {
  const { params, ...fetchOptions } = options;

  // Build URL with query parameters
  let url = endpoint;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url = `${endpoint}?${searchParams.toString()}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// SERVER COMPONENT FETCHER
// Use this in Server Components and Route Handlers
export async function serverFetcher<T>(
  endpoint: string,
  options: FetcherOptions = {}
): Promise<T> {
  const { cookies } = await import('next/headers');
  const { redirect } = await import('next/navigation');
  const cookieStore = await cookies();
  
  // Get all cookies and format them as a Cookie header
  const cookieHeader = cookieStore
    .getAll()
    .map(cookie => `${cookie.name}=${cookie.value}`)
    .join('; ');

  try {
    return await baseFetcherServer<T>(
      endpoint,
      {
        ...options,
        headers: {
          Cookie: cookieHeader,
          ...options.headers,
        },
        cache: options.cache || 'no-store',
      }
    );
  } catch (error) {
    // If we get a 401, redirect to login
    if (error instanceof Error && error.message.includes('401')) {
      redirect('/login');
    }
    // Re-throw other errors
    throw error;
  }
}

// CLIENT COMPONENT FETCHER
// Use this in Client Components
export async function clientFetcher<T>(
  endpoint: string,
  options: FetcherOptions = {}
): Promise<T> {
  return baseFetcherWithRetry<T>(
    endpoint,
    {
      ...options,
      credentials: 'include',
    },
    refreshTokensClient
  );
}

// USAGE EXAMPLES:

// In a Server Component:
// const data = await serverFetcher<UserData>('/api/user');
// If the request returns 401, user will be redirected to /login

// In a Client Component:
// const fetchUser = async () => {
//   try {
//     const data = await clientFetcher<UserData>('/api/user');
//     setUser(data);
//   } catch (error) {
//     // Handle authentication failure
//     console.error('Failed to fetch user:', error);
//   }
// };
// If the request returns 401, it will automatically:
// 1. Call the refresh endpoint
// 2. Retry the original request
// 3. Return the data or throw an error

// With query parameters:
// const data = await serverFetcher<SearchResults>('/api/search', {
//   params: { q: 'nextjs', limit: '10' }
// });

// With POST request:
// const data = await clientFetcher<CreateResponse>('/api/items', {
//   method: 'POST',
//   body: JSON.stringify({ name: 'New Item' }),
// });
