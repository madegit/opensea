// src/components/formHandler.js
export async function submitForm(formData) {
  try {
    // Use the correct API URL based on the environment
    const API_URL = import.meta.env.PROD 
      ? 'https://www.collablink.online/api/send-email'  // Production URL
      : '/api/send-email';  // Development URL (will be proxied by Vite)

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Function to get user's IP address
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