interface ApiErrorBody {
  error?: string;
}

interface CsrfResponse {
  csrfToken: string;
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '') || '';
let csrfToken: string | null = null;
let csrfRequest: Promise<string> | null = null;

const requestCsrfToken = async () => {
  if (csrfToken) return csrfToken;
  if (!csrfRequest) {
    csrfRequest = fetch(`${apiBaseUrl}/api/auth/csrf`, {
      credentials: 'include',
      cache: 'no-store'
    }).then(async response => {
      if (!response.ok) throw new Error('Unable to prepare a secure request. Reload and try again.');
      const body = await response.json() as CsrfResponse;
      if (!body.csrfToken) throw new Error('The server did not issue a CSRF token.');
      csrfToken = body.csrfToken;
      return body.csrfToken;
    }).finally(() => {
      csrfRequest = null;
    });
  }
  return csrfRequest;
};

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const method = (options.method || 'GET').toUpperCase();
  const headers = new Headers(options.headers);
  if (options.body && !headers.has('content-type')) headers.set('content-type', 'application/json');
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    headers.set('x-csrf-token', await requestCsrfToken());
  }
  const response = await fetch(`${apiBaseUrl}/api${path}`, {
    ...options,
    method,
    headers,
    credentials: 'include',
    cache: 'no-store'
  });
  if (!response.ok) {
    let message = `Request failed (${response.status}).`;
    try {
      const body = await response.json() as ApiErrorBody;
      if (body.error) message = body.error;
    } catch {
      message = `Request failed (${response.status}).`;
    }
    if (response.status === 401) csrfToken = null;
    throw new Error(message);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const getApiSocketOrigin = () =>
  apiBaseUrl || window.location.origin;
