const TOKEN_KEY = 'app_access_token';

export const getAccessToken = (): string | null => localStorage.getItem(TOKEN_KEY);
export const setAccessToken = (token: string): void => localStorage.setItem(TOKEN_KEY, token);
export const clearAccessToken = (): void => localStorage.removeItem(TOKEN_KEY);