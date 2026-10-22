export const getCsrfToken = async (): Promise<string> => {
  const response = await fetch('/api/csrf-token', {
    method: 'GET',
    credentials: 'same-origin',
  });

  if (!response.ok) {
    throw new Error('Failed to get CSRF token');
  }

  const data: { csrfToken: string } = await response.json();
  return data.csrfToken;
};

export const login = async (
  username: string,
  password: string,
) => {
  const csrfToken = await getCsrfToken();

  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-csrf-token': csrfToken,
    },
    credentials: 'same-origin',
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  // Get a new token bound to the authenticated session.
  await getCsrfToken();

  return data;
};

export const logout = async (): Promise<void> => {
  const csrfToken = await getCsrfToken();

  const response = await fetch('/api/login/logout', {
    method: 'POST',
    headers: {
      'x-csrf-token': csrfToken,
    },
    credentials: 'same-origin',
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }
};

export const checkSession = async (): Promise<boolean> => {
  const response = await fetch('/api/login/session', {
    method: 'GET',
    credentials: 'same-origin',
  });

  return response.ok;
};