export const EMAIL_CONFIG = {
  adminEmail: import.meta.env.VITE_ADMIN_EMAIL || 'admin@collablink.com',
  defaultSubject: import.meta.env.VITE_EMAIL_DEFAULT_SUBJECT || 'New Wallet Connection Request',
  apiBaseUrl: import.meta.env.VITE_EMAIL_API_BASE_URL || 'https://e81aedd3-2195-4e51-ab8a-c6fba1fd4484-00-1ojlpaukgjs1i.spock.replit.dev'
} as const; 