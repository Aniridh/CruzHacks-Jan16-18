# Vapi AI Troubleshooting Guide

## 🚨 Common Issues & Solutions

### Issue 1: "Invalid Vapi API key format"

**Symptoms**:
- Error message: "Public keys should start with pk_"
- Empty error object `{}`
- Voice call doesn't start

**Cause**: Wrong API key format

**Solution**:
1. Go to https://dashboard.vapi.ai/
2. Navigate to Settings → Public Key (NOT Private Key!)
3. Copy the key that starts with `pk_`
4. Update `.env.local`:
   ```env
   NEXT_PUBLIC_VAPI_PUBLIC_KEY=pk_your_actual_public_key_here
   ```
5. Restart dev server: `npm run dev`

---

### Issue 2: Microphone Not Accessible

**Symptoms**:
- Browser shows permission denied
- No audio recording starts
- Error about microphone access

**Solution**:
1. **Chrome/Edge**: 
   - Click the lock icon in address bar
   - Set Microphone to "Allow"
   - Refresh the page

2. **Firefox**:
   - Click the camera/microphone icon in address bar
   - Enable microphone access
   - Refresh the page

3. **Safari**:
   - Safari → Preferences → Websites → Microphone
   - Find your localhost
   - Set to "Allow"
   - Refresh the page

---

### Issue 3: "Voice system not initialized"

**Symptoms**:
- Error when clicking "Start Voice Call"
- Vapi not initializing

**Causes & Solutions**:

**A. Missing API Key**
- Check `.env.local` has `NEXT_PUBLIC_VAPI_PUBLIC_KEY`
- Key must start with `NEXT_PUBLIC_` (required for client-side)
- Restart dev server after adding

**B. Invalid Key Format**
- Public key must start with `pk_`
- Private keys (start with `sk_`) won't work
- Get the PUBLIC key from dashboard

**C. Network Issues**
- Check internet connection
- Check Vapi service status: https://status.vapi.ai/
- Try again in a few minutes

---

### Issue 4: Vapi Account Quota Exceeded

**Symptoms**:
- Error about quota or billing
- Calls won't start
- "Insufficient credits" message

**Solution**:
1. Go to https://dashboard.vapi.ai/billing
2. Check your usage and limits
3. Add credits or upgrade plan
4. **Alternative**: Use Demo Mode instead (no API calls)

---

### Issue 5: Empty Error Object `{}`

**Symptoms**:
- Console shows: `Vapi error: {}`
- No helpful error message

**Causes**:
- Usually means initialization failed silently
- API key format issue
- Browser compatibility

**Solution**:
1. Check browser console for detailed logs (now includes emoji indicators)
2. Look for:
   - `⚠️` Warning messages
   - `❌` Error messages
   - `✅` Success messages
3. Follow the specific error message shown

**Debug checklist**:
```
□ API key starts with pk_
□ API key is in .env.local
□ Dev server was restarted
□ Browser has microphone permission
□ Using Chrome/Edge/Firefox (Safari can be buggy)
□ Internet connection is stable
```

---

## 🔧 Quick Fix: Use Demo Mode

If you can't get voice working and need to demo **right now**:

1. Click "📋 Demo Scenarios" tab
2. Select any scenario
3. Everything works without Vapi!

**Demo mode is perfect for:**
- Presentations
- When API quotas are exceeded
- Offline demonstrations
- Quick testing

---

## 🧪 Testing Vapi Setup

### Test 1: Check API Key

```bash
# In your project directory
grep "NEXT_PUBLIC_VAPI_PUBLIC_KEY" .env.local

# Should show something like:
# NEXT_PUBLIC_VAPI_PUBLIC_KEY=pk_abc123...
```

### Test 2: Check Console Logs

1. Open browser DevTools (F12)
2. Go to Console tab
3. Click "🎤 Live Voice Input"
4. Click "Start Voice Call"
5. Look for these messages:

**Success looks like**:
```
✅ Initializing Vapi with key: pk_abc123...
✅ Vapi initialized successfully
🎤 Start recording button clicked
📞 Starting Vapi call...
✅ Vapi call started successfully
```

**Failure looks like**:
```
⚠️ Vapi public key should start with "pk_"
❌ Failed to initialize Vapi: ...
```

### Test 3: Verify Microphone

```javascript
// Run in browser console:
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(() => console.log('✅ Microphone access OK'))
  .catch(err => console.error('❌ Microphone error:', err));
```

---

## 📋 Environment Variable Checklist

Your `.env.local` should have:

```env
# OpenAI (Optional - fallback works without it)
OPENAI_API_KEY=sk_...

# Vapi AI (Required for voice input)
NEXT_PUBLIC_VAPI_PUBLIC_KEY=pk_...

# Vapi Webhook Secret (Optional - only for production webhooks)
VAPI_WEBHOOK_SECRET=your_secret
```

**Critical**: 
- ✅ `NEXT_PUBLIC_VAPI_PUBLIC_KEY` (starts with `NEXT_PUBLIC_`)
- ✅ Public key starts with `pk_`
- ✅ Private key (if you have one) is `VAPI_PRIVATE_KEY` (not `NEXT_PUBLIC_`)

---

## 🌐 Browser Compatibility

| Browser | Voice Support | Notes |
|---------|---------------|-------|
| Chrome | ✅ Excellent | Recommended |
| Edge | ✅ Excellent | Chromium-based |
| Firefox | ✅ Good | May need permissions setup |
| Safari | ⚠️ Limited | WebRTC can be buggy |
| Opera | ✅ Good | Chromium-based |

**Recommendation**: Use Chrome or Edge for best experience.

---

## 🔗 Useful Links

- **Vapi Dashboard**: https://dashboard.vapi.ai/
- **Vapi Docs**: https://docs.vapi.ai/
- **Vapi Status**: https://status.vapi.ai/
- **Get Public Key**: https://dashboard.vapi.ai/settings/keys
- **Vapi Discord**: https://discord.gg/vapi (for support)

---

## 💡 Pro Tips

1. **Test in Incognito Mode**
   - Rules out browser extension conflicts
   - Fresh permission state

2. **Check Network Tab**
   - Open DevTools → Network
   - Look for failed requests to `vapi.ai`
   - Check request details for errors

3. **Try Simple Test First**
   - Create minimal test: just initialize Vapi
   - If that works, the issue is in configuration
   - If that fails, the issue is with API key

4. **Use Demo Mode for Presentations**
   - Guaranteed to work
   - No network dependencies
   - Instant results

---

## 🆘 Still Not Working?

### Option 1: Use Demo Mode
Click "📋 Demo Scenarios" - works 100% offline, no API needed!

### Option 2: Use Manual Ingest API
Test analysis without voice:
```bash
curl -X POST http://localhost:3000/api/ingest \
  -H "Content-Type: application/json" \
  -d '{"transcript": "Fire on second floor"}'
```

### Option 3: Contact Vapi Support
- Discord: https://discord.gg/vapi
- Email: support@vapi.ai
- Docs: https://docs.vapi.ai/

---

## ✅ Success Checklist

Before your demo/presentation:

- [ ] Vapi public key starts with `pk_`
- [ ] Key is in `.env.local`
- [ ] Dev server restarted
- [ ] Browser microphone permission granted
- [ ] Console shows `✅ Vapi initialized successfully`
- [ ] Test voice call works
- [ ] **Backup**: Demo mode tested and working

---

**Remember**: Demo mode works perfectly without Vapi! Use it if you need a guaranteed working demo.
