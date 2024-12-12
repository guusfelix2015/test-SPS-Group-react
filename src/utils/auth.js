import { api } from '../config/api';

const ACCESS_TOKEN_STORAGE_KEY = '@App:token';

export const getAccessToken = () => {
  const credentials = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  if (!credentials) return;
  const { token } = JSON.parse(credentials);
  return token;
};

export const isAuthenticated = () => {
  const accessToken = getAccessToken();
  return !!accessToken;
};

export const setAccessToken = (accessToken) => {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
};

export const saveAccessToken = (context) => {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, JSON.stringify(context));
};

export const removeAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
};

export const setAccessTokenToApiClient = (accessToken) => {
  api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
}; 