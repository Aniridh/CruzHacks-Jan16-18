# IGNIS Setup Instructions

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API Keys

The `.env.local` file has been created in the project root. Open it and add your OpenAI API key:

```bash
# Edit .env.local
OPENAI_API_KEY=sk-...your-actual-key-here...
```

**Get your OpenAI API key:**
- Visit https://platform.openai.com/api-keys
- Create a new API key
- Copy and paste it into `.env.local`

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at:
- **Dashboard**: http://localhost:3000
- **Landing Page**: http://localhost:3000/landing

## Environment Variables

### Required

- **OPENAI_API_KEY** - Your OpenAI API key for GPT-4 analysis

### Optional (Future Integration)

- **VAPI_API_KEY** - Vapi AI key for voice transcription
- **VAPI_PHONE_NUMBER** - Vapi phone number

## File Locations

- **`.env.local`** - Your actual API keys (NOT committed to Git)
- **`.env.example`** - Template file (committed to Git)
- **`.gitignore`** - Ensures `.env.local` is never committed

## Testing the Application

1. Navigate to http://localhost:3000
2. Select a demo scenario (e.g., "Apartment Fire - Second Floor")
3. The system will:
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

### "Error 429 - Rate Limit"

**Solution**: You've exceeded OpenAI's rate limit. Wait a moment or upgrade your plan.

### "Error 401 - Unauthorized"

**Solution**: Your API key is invalid. Check that:
1. You copied the entire key
2. The key hasn't been revoked
3. Your OpenAI account is active

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

3. Add environment variable:
   - In project settings → Environment Variables
   - Add `OPENAI_API_KEY` with your key
   - Click "Save"

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
2. ✅ Start dev server: `npm run dev`
3. ✅ Test with demo scenarios
4. ✅ View landing page at `/landing`
5. ✅ Deploy to Vercel when ready

---

**Ready to go!** Add your API key and start the dev server. 🚀
