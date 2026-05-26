export async function apiFetcher<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {})
    }
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.message ?? 'Unexpected API error');
  }

  return payload as T;
}
