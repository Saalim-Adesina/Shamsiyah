// Vercel Serverless Function - API Proxy for Waitlist Form
// This hides your Google Apps Script URL from the client

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Ensure body is parsed (handles both parsed objects and raw JSON strings)
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { name, email, useCase, timestamp } = body;

    // Basic validation
    if (!name || !email || !useCase) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'Name, email, and use case are required' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email',
        message: 'Please provide a valid email address' 
      });
    }

    // Get Google Apps Script URL from environment variable
    const scriptURL = process.env.GOOGLE_SCRIPT_URL;
    
    if (!scriptURL) {
      console.error('GOOGLE_SCRIPT_URL environment variable not set');
      return res.status(500).json({ 
        error: 'Configuration error',
        message: 'Server configuration error. Please contact support.' 
      });
    }

    // Forward to Google Apps Script
    const response = await fetch(scriptURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        useCase,
        timestamp: timestamp || new Date().toLocaleString()
      }),
    });

    if (!response.ok) {
      throw new Error(`Google Apps Script returned ${response.status}`);
    }

    const result = await response.json();

    return res.status(200).json({
      success: true,
      message: 'Successfully joined the waitlist!',
      data: result
    });

  } catch (error) {
    console.error('Error submitting to waitlist:', error);
    return res.status(500).json({ 
      error: 'Submission failed',
      message: 'An error occurred while processing your request. Please try again.' 
    });
  }
}
