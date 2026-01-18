# IGNIS Setup Instructions

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API Keys

The `.env.local` file has been created in the project root. Open it and add your API keys:

```bash
# Edit .env.local

# OpenAI (Required for analysis)
OPENAI_API_KEY=sk-...your-actual-key-here...

# Vapi AI (Required for voice input)
NEXT_PUBLIC_VAPI_PUBLIC_KEY=pk_...your-actual-key-here...
```

**Get your OpenAI API key:**
- Visit https://platform.openai.com/api-keys
- Create a new API key
- Copy and paste it into `.env.local`

**Get your Vapi AI public key:**
- Visit https://dashboard.vapi.ai/
- Sign up or log in
- Go to Settings → Public Key
- Copy the public key (starts with `pk_`)
- Paste it into `.env.local`

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at:
- **Dashboard**: http://localhost:3000
- **Landing Page**: http://localhost:3000/landing

## Environment Variables

### Required for Full Functionality

- **OPENAI_API_KEY** - Your OpenAI API key for GPT-4 situation analysis
- **NEXT_PUBLIC_VAPI_PUBLIC_KEY** - Your Vapi AI public key for live voice input

### Demo Mode Only (No API Keys Needed)

If you don't want to use voice input, you can skip Vapi AI setup and just use demo scenarios with only the OpenAI key.

## File Locations

- **`.env.local`** - Your actual API keys (NOT committed to Git)
- **`.env.example`** - Template file (committed to Git)
- **`.gitignore`** - Ensures `.env.local` is never committed

## Testing the Application

### Option 1: Live Voice Input

1. Navigate to http://localhost:3000
2. Ensure you're on "Live Voice Input" mode (🎤)
3. Click "Start Voice Call"
4. Speak about an emergency (e.g., "There's a fire on the second floor near the stairwell...")
5. The AI assistant will ask clarifying questions
6. Click "End Call & Analyze"
7. The system will:
   - Analyze your transcript with GPT-4
   - Extract fire origin, hazards, and urgency
   - Generate visualization with risk zones
   - Display decision reasoning

### Option 2: Demo Scenarios

1. Navigate to http://localhost:3000
2. Switch to "Demo Scenarios" mode (📋)
3. Select a demo scenario (e.g., "Apartment Fire - Second Floor")
4. The system will:
   - Send the transcript to GPT-4 for analysis
   - Extract fire origin, hazards, and urgency
   - Generate visualization with risk zones
   - Display decision reasoning

## Common Issues

### "OpenAI API key not configured"

**Solution**: Check that:
1. `.env.local` exists in the project root
2. `OPENAI_API_KEY` is set to your actual key (starts with `sk-`)
3. You've restarted the dev server after adding the key

### "Vapi API key not configured"

**Solution**: Check that:
1. `.env.local` exists in the project root
2. `NEXT_PUBLIC_VAPI_PUBLIC_KEY` is set to your actual key (starts with `pk_`)
3. You've restarted the dev server after adding the key
4. The key starts with `NEXT_PUBLIC_` (required for client-side access)

**Note**: If you don't want to use voice input, just use Demo Scenarios mode instead.

### "Failed to start recording" or "Voice system not initialized"

**Possible causes**:
- Missing Vapi API key
- Microphone not accessible (browser permissions)
- Invalid API key format

**Solution**: 
1. Check browser console for detailed errors
2. Verify microphone permissions in browser settings
3. Confirm Vapi API key is correct
4. Try refreshing the page

### "Error 429 - Rate Limit"

**Solution**: You've exceeded OpenAI's or Vapi's rate limit. Wait a moment or upgrade your plan.

### "Error 401 - Unauthorized"

**Solution**: Your API key is invalid. Check that:
1. You copied the entire key
2. The key hasn't been revoked
3. Your account is active

## Deployment to Vercel

### Option 1: Via Vercel Dashboard

1. Push code to GitHub:
   ```bash
   ./push.sh
   ```

2. Import project in Vercel:
   - Go to https://vercel.com
   - Click "Import Project"
   - Select your GitHub repository

3. Add environment variables:
   - In project settings → Environment Variables
   - Add `OPENAI_API_KEY` with your OpenAI key
   - Add `NEXT_PUBLIC_VAPI_PUBLIC_KEY` with your Vapi key
   - Click "Save" for each

4. Deploy!

### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variable
vercel env add OPENAI_API_KEY
```

## Directory Structure

```
/
├── .env.local              # Your API keys (not in Git)
├── .env.example           # Template (in Git)
├── app/                   # Next.js pages
│   ├── page.tsx          # Dashboard
│   ├── landing/          # Landing page
│   └── api/              # Backend API routes
├── components/           # React components
├── data/                 # Layouts & scenarios
├── types/                # TypeScript types
└── utils/                # Utility functions
```

## Security Notes

- ✅ `.env.local` is in `.gitignore` (won't be committed)
- ✅ API keys are server-side only (not exposed to browser)
- ✅ `.env.example` is safe to commit (no actual keys)
- ⚠️ Never commit actual API keys to Git
- ⚠️ Don't share your `.env.local` file

## Need Help?

1. Check the error message in terminal
2. Verify `.env.local` is configured correctly
3. Ensure dev server is restarted after env changes
4. Check OpenAI API dashboard for usage/limits

## Next Steps

1. ✅ Add your OpenAI API key to `.env.local`
2. ✅ Add your Vapi AI public key to `.env.local` (for voice input)
3. ✅ Start dev server: `npm run dev`
4. ✅ Test with live voice input or demo scenarios
5. ✅ View landing page at `/landing`
6. ✅ Deploy to Vercel when ready

## Additional Resources

- **Vapi AI Setup Guide**: See `VAPI_SETUP.md` for detailed voice input documentation
- **Git Workflow**: See `GIT_WORKFLOW.md` for commit and push instructions
- **Implementation Summary**: See `IMPLEMENTATION_SUMMARY.md` for project overview

---

**Ready to go!** Add your API keys and start the dev server. 🚀
