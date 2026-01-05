# Shamsiyah Waitlist - Secure Deployment Guide

## Prerequisites
- A Vercel account (free tier is sufficient)
- A Google Account with access to Google Apps Script
- Your Google Sheet ID

## Step 1: Set Up Google Apps Script

1. **Create a Google Sheet:**
   - Go to [Google Sheets](https://sheets.google.com)
   - Create a new spreadsheet named "Shamsiyah Waitlist"
   - Note the Sheet ID from the URL: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit`

2. **Set Up the Script:**
   - Go to [Google Apps Script](https://script.google.com)
   - Click "New Project"
   - Replace all code with the content from `google-apps-script.js`
   - Update line 11: Replace `'0'` with your actual Sheet ID
   - Save the project (name it "Shamsiyah Waitlist Handler")

3. **Deploy the Web App:**
   - Click "Deploy" → "New deployment"
   - Click the gear icon ⚙️ next to "Select type"
   - Choose "Web app"
   - Fill in the settings:
     - **Description:** "Shamsiyah Waitlist API"
     - **Execute as:** Me (your email)
     - **Who has access:** Anyone
   - Click "Deploy"
   - **IMPORTANT:** Copy the Web App URL (looks like: `https://script.google.com/macros/s/AKfycby...../exec`)
   - Keep this URL SECRET - never commit it to Git!

4. **Grant Permissions:**
   - You'll be asked to authorize the script
   - Click "Authorize access"
   - Choose your Google account
   - Click "Advanced" if you see a warning
   - Click "Go to [Project Name] (unsafe)" - this is safe, it's your own script
   - Click "Allow"

## Step 2: Deploy to Vercel

1. **Install Vercel CLI (Optional but recommended):**
   ```bash
   npm install -g vercel
   ```

2. **Prepare Your Repository:**
   - Make sure your `.gitignore` file includes `.env` files
   - **DO NOT** commit your Google Apps Script URL to Git
   - Commit all other changes:
     ```bash
     git add .
     git commit -m "Add Vercel deployment configuration"
     git push
     ```

3. **Deploy to Vercel:**

   **Option A: Via Vercel Dashboard (Recommended for first time)**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import your Git repository
   - Vercel will auto-detect the configuration from `vercel.json`
   - **BEFORE DEPLOYING:** Add Environment Variable:
     - Click "Environment Variables"
     - Name: `GOOGLE_SCRIPT_URL`
     - Value: Paste your Google Apps Script URL
     - Select all environments (Production, Preview, Development)
     - Click "Add"
   - Click "Deploy"

   **Option B: Via CLI**
   ```bash
   cd "s:\Saalim\Qatar University\Injaz\Website\Shamsiyah"
   vercel
   ```
   - Follow the prompts
   - When prompted, add the environment variable:
     ```bash
     vercel env add GOOGLE_SCRIPT_URL
     ```
   - Paste your Google Apps Script URL when prompted
   - Choose "Production" environment

4. **Verify Deployment:**
   - Vercel will give you a deployment URL (e.g., `your-project.vercel.app`)
   - Visit `your-project.vercel.app/waitlist`
   - Test the form submission
   - Check your Google Sheet to verify data is being saved

## Step 3: Update Environment Variables (If Needed)

To update your Google Script URL later:

```bash
vercel env rm GOOGLE_SCRIPT_URL production
vercel env add GOOGLE_SCRIPT_URL production
```

Or via the Vercel Dashboard:
1. Go to your project
2. Settings → Environment Variables
3. Edit the `GOOGLE_SCRIPT_URL` value

## Step 4: Custom Domain (Optional)

1. Go to your Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Follow Vercel's instructions to update DNS records

## Security Best Practices

✅ **DO:**
- Keep your Google Apps Script URL in Vercel's environment variables only
- Use the `.gitignore` file to exclude `.env` files
- Regularly check your Google Sheet access permissions
- Monitor your form submissions for spam

❌ **DON'T:**
- Never commit `.env` files to Git
- Never expose your Google Apps Script URL in client-side code
- Don't share your deployment URLs publicly until you're ready

## Testing the Form

1. Visit your deployment URL
2. Go to `/waitlist` page
3. Fill out the form with test data
4. Submit the form
5. Check your Google Sheet - you should see the new entry
6. Verify the success message appears

## Troubleshooting

### Form submission fails:
- Check Vercel logs: `vercel logs`
- Verify `GOOGLE_SCRIPT_URL` environment variable is set correctly
- Ensure Google Apps Script is deployed as "Web app" with "Anyone" access

### Google Sheet not updating:
- Check Google Apps Script execution logs
- Verify the Sheet ID is correct in the script
- Ensure the sheet name is exactly "Waitlist"

### CORS errors:
- The API route handles CORS automatically
- If issues persist, check browser console for specific errors

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Google Apps Script execution logs
3. Review browser console for errors
4. Verify all environment variables are set correctly

## API Endpoint

Once deployed, your form will submit to:
```
POST https://your-project.vercel.app/api/submit-waitlist
```

This endpoint is protected and proxies requests to your Google Apps Script securely.
