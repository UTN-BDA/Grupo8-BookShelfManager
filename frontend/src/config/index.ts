export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  appName: import.meta.env.VITE_APP_NAME || 'BookShelf Manager',
  tokenExpiry: Number(import.meta.env.VITE_TOKEN_EXPIRY) || 86400000, 
};
