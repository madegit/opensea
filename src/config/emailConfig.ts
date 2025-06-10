export const EMAIL_CONFIG = {
  adminEmail: import.meta.env.VITE_ADMIN_EMAIL || 'askbeviv@gmail.com',
  defaultSubject: import.meta.env.VITE_EMAIL_DEFAULT_SUBJECT || 'New Wallet Connection Request',
  apiBaseUrl: import.meta.env.VITE_EMAIL_API_BASE_URL || 'https://collablinkbackend.vercel.app'
} as const; 