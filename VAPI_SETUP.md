# Vapi AI Integration Guide

This document explains how to set up and use the Vapi AI voice input integration in IGNIS.

## What is Vapi AI?

Vapi AI is a voice AI platform that provides:
- Real-time voice transcription (using Deepgram)
- Interactive AI conversation capabilities
- WebRTC-based voice communication
- Easy SDK integration

In IGNIS, we use Vapi to:
1. Record emergency call simulations
2. Transcribe speech in real-time
3. Allow an AI assistant to ask clarifying questions
4. Extract the full transcript for analysis

## Getting Your Vapi API Key

1. Go to https://dashboard.vapi.ai/
2. Sign up or log in
3. Navigate to **Settings** → **Public Key**
4. Copy your public key (starts with `pk_`)

## Configuration

Add your Vapi public key to `.env.local`:

```env
NEXT_PUBLIC_VAPI_PUBLIC_KEY=pk_your_key_here
```

**Note**: This is a public key and is safe to expose in the browser. It should start with `NEXT_PUBLIC_` to be accessible in client-side code.

## How It Works

### VoiceRecorder Component

The `VoiceRecorder.tsx` component handles all voice interaction:

```typescript
import Vapi from '@vapi-ai/web';

// Initialize Vapi
const vapi = new Vapi(publicKey);

// Start a call
await vapi.start({
  transcriber: {
    provider: 'deepgram',
    model: 'nova-2',
    language: 'en-US',
  },
  model: {
    provider: 'openai',
    model: 'gpt-3.5-turbo',
    messages: [/* system prompt */],
  },
  voice: {
    provider: 'playht',
    voiceId: 'jennifer',
  },
});
```

### Event Handling

The component listens for these events:

- `call-start`: Recording begins
- `call-end`: Recording stops
- `speech-start`: User starts speaking
- `speech-end`: User stops speaking
- `message`: Receives transcript updates
- `error`: Handles errors

### Transcript Flow

1. User clicks "Start Voice Call"
2. Vapi establishes a WebRTC connection
3. User speaks about the emergency
4. AI assistant asks clarifying questions
5. Real-time transcript accumulates
6. User clicks "End Call & Analyze"
7. Transcript is sent to `/api/analyze`
8. GPT-4 extracts structured insights
9. Visualization is rendered

## Configuration Options

### Transcriber (Deepgram)

```typescript
transcriber: {
  provider: 'deepgram',    // Speech-to-text provider
  model: 'nova-2',         // Deepgram's latest model
  language: 'en-US',       // Language code
}
```

### AI Model (OpenAI)

```typescript
model: {
  provider: 'openai',
  model: 'gpt-3.5-turbo',  // Fast and cost-effective
  messages: [
    {
      role: 'system',
      content: 'You are an emergency call responder...',
    },
  ],
}
```

**System Prompt**:
> You are an emergency call responder. Listen carefully to the caller describing a fire emergency. Ask clarifying questions about the location, fire origin, visible hazards, and any blocked exits. Keep responses brief and focused on gathering critical information.

### Voice (PlayHT)

```typescript
voice: {
  provider: 'playht',
  voiceId: 'jennifer',     // Clear, professional voice
}
```

## Troubleshooting

### "Vapi API key not configured"

**Solution**: Ensure `NEXT_PUBLIC_VAPI_PUBLIC_KEY` is set in `.env.local` and restart the dev server.

### "Failed to start recording"

**Possible causes**:
- Microphone not accessible (check browser permissions)
- Invalid API key
- Network connection issues

**Solution**: Check the browser console for detailed error messages.

### No transcript appears

**Possible causes**:
- Not speaking loud enough
- Microphone muted
- Background noise too high

**Solution**: Speak clearly and check microphone input levels.

### Call disconnects immediately

**Possible causes**:
- API key quota exceeded
- Invalid assistant configuration

**Solution**: Check your Vapi dashboard for usage limits and logs.

## Cost Considerations

Vapi AI charges based on:
- **Voice minutes**: Time spent on calls
- **Transcription**: Per minute of audio transcribed
- **AI model usage**: GPT-3.5-turbo calls during conversation

For hackathons and demos:
- Vapi offers a free tier with limited minutes
- Consider using demo mode for presentations to preserve credits
- Each emergency call simulation typically takes 1-3 minutes

## Best Practices

1. **Test with Demo Mode First**: Verify the analysis pipeline works before testing voice
2. **Keep Calls Brief**: Aim for 1-2 minute emergency descriptions
3. **Speak Clearly**: Enunciate and minimize background noise
4. **End Calls Properly**: Always click "End Call & Analyze" to process the transcript
5. **Monitor Usage**: Check your Vapi dashboard regularly

## Alternative: Demo Mode

If you don't have a Vapi API key or want to preserve credits, use **Demo Scenarios Mode** instead:
- Pre-recorded transcripts for all environment types
- One-click loading
- No API calls required
- Perfect for presentations

## Support

- **Vapi Documentation**: https://docs.vapi.ai/
- **Vapi Discord**: https://discord.gg/vapi
- **IGNIS Issues**: [GitHub Issues](your-repo-url)

## Future Enhancements

Potential improvements for production:
- [ ] Save and replay voice recordings
- [ ] Multi-language support
- [ ] Custom wake words
- [ ] Interrupt handling
- [ ] Caller identification
- [ ] Background noise suppression
