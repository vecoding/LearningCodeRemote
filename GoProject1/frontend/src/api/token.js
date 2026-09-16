const TOKEN_KEY = 'exchangeapp:token';
const USERNAME_KEY = 'exchangeapp:username';

export const getToken = () => localStorage.getItem(TOKEN_KEY) || '';
export const getUsername = () => localStorage.getItem(USERNAME_KEY) || '';

export function setAuth(token, username) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USERNAME_KEY, username);
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);
}
