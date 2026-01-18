'use client';

import { useState, useLayoutEffect } from 'react';
import Vapi from '@vapi-ai/web';

interface VoiceRecorderProps {
  onTranscriptComplete: (transcript: string) => void;
}

interface VapiMessage {
  type?: string;
  transcriptType?: string;
  transcript?: string;
  [key: string]: unknown;
}

interface VapiError {
  message?: string;
  [key: string]: unknown;
}

export default function VoiceRecorder({ onTranscriptComplete }: VoiceRecorderProps) {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Use useLayoutEffect for synchronous initialization error handling
  useLayoutEffect(() => {
    // Initialize Vapi
    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    
    if (!publicKey) {
      setError('Vapi API key not configured. Please add NEXT_PUBLIC_VAPI_PUBLIC_KEY to .env.local');
      return;
    }

    // Validate key format (UUID or pk_ format)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(publicKey);
    const isPkFormat = publicKey.startsWith('pk_');
    
    if (!isUUID && !isPkFormat) {
      console.warn('⚠️ Vapi public key format not recognized. Key:', publicKey.substring(0, 10) + '...');
      setError('Invalid Vapi API key format. Check https://dashboard.vapi.ai/ → Settings → Public Key');
      return;
    }

    console.log('✅ Initializing Vapi with key:', publicKey.substring(0, 15) + '...');
    console.log('Key format:', isUUID ? 'UUID' : 'pk_ format');

    let vapiInstance: Vapi;
    try {
      vapiInstance = new Vapi(publicKey);
      setVapi(vapiInstance);
      console.log('✅ Vapi initialized successfully');
    } catch (err) {
      console.error('❌ Failed to initialize Vapi:', err);
      setError('Failed to initialize Vapi: ' + (err instanceof Error ? err.message : 'Unknown error'));
      return;
    }

    // Event listeners
    vapiInstance.on('call-start', () => {
      console.log('Call started');
      setIsRecording(true);
      setError(null);
    });

    vapiInstance.on('call-end', () => {
      console.log('Call ended');
      setIsRecording(false);
      setIsSpeaking(false);
    });

    vapiInstance.on('speech-start', () => {
      console.log('User started speaking');
      setIsSpeaking(true);
    });

    vapiInstance.on('speech-end', () => {
      console.log('User stopped speaking');
      setIsSpeaking(false);
    });

    vapiInstance.on('message', (message: VapiMessage) => {
      console.log('Message received:', message);
      
      // Handle transcript updates
      if (message.type === 'transcript' && message.transcriptType === 'final' && message.transcript) {
        setTranscript((prev) => prev + ' ' + message.transcript);
      }
    });

    vapiInstance.on('error', (error: VapiError) => {
      console.error('❌ Vapi error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      let errorMessage = 'An error occurred with voice recording';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object') {
        // Try to extract useful info from error object
        const errorStr = JSON.stringify(error);
        if (errorStr && errorStr !== '{}') {
          errorMessage = `Voice recording error: ${errorStr}`;
        } else {
          errorMessage = 'Voice recording failed. Check browser console for details.';
        }
      }
      
      setError(errorMessage);
      setIsRecording(false);
    });

    return () => {
      vapiInstance.stop();
    };
  }, []); // Only run once on mount

  const startRecording = async () => {
    console.log('🎤 Start recording button clicked');
    
    if (!vapi) {
      console.error('❌ Vapi not initialized');
      setError('Voice system not initialized. Please refresh the page.');
      return;
    }

    try {
      setTranscript('');
      setError(null);
      
      console.log('📞 Starting Vapi call...');
      console.log('Vapi instance:', vapi);
      
      // Check microphone permission first
      console.log('🎙️ Checking microphone access...');
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('✅ Microphone access granted');
        stream.getTracks().forEach(track => track.stop()); // Stop test stream
      } catch (micError) {
        console.error('❌ Microphone access denied:', micError);
        throw new Error('Microphone access denied. Please allow microphone access in your browser settings.');
      }
      
      console.log('🚀 Calling vapi.start()...');
      
      // Check if assistant ID is provided (preferred method)
      const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
      
      if (assistantId) {
        console.log('Using assistant ID:', assistantId.substring(0, 10) + '...');
        await vapi.start(assistantId);
      } else {
        console.log('Using inline assistant configuration (no assistant ID provided)');
        
        // Inline assistant configuration
        const assistantConfig = {
          transcriber: {
            provider: 'deepgram' as const,
            model: 'nova-2',
            language: 'en-US',
          },
          model: {
            provider: 'openai' as const,
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system' as const,
                content: 'You are an emergency call responder. Listen carefully to the caller describing a fire emergency. Ask clarifying questions about the location, fire origin, visible hazards, and any blocked exits. Keep responses brief and focused on gathering critical information.',
              },
            ],
          },
          voice: {
            provider: 'playht' as const,
            voiceId: 'jennifer',
          },
        };
        
        console.log('Assistant config:', JSON.stringify(assistantConfig, null, 2));
        
        await vapi.start(assistantConfig);
      }
      
      console.log('✅ Vapi call started successfully');
    } catch (err) {
      console.error('❌ Error starting recording:', err);
      console.error('Error type:', typeof err);
      console.error('Error constructor:', err?.constructor?.name);
      console.error('Error details:', JSON.stringify(err, null, 2));
      console.error('Error stack:', err instanceof Error ? err.stack : 'No stack');
      
      let errorMessage = 'Failed to start recording';
      if (err instanceof Error) {
        errorMessage = err.message;
        console.error('Error message:', err.message);
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err && typeof err === 'object') {
        // Try to extract any useful info
        const errObj = err as Record<string, unknown>;
        if (errObj.message) errorMessage = String(errObj.message);
        else if (errObj.error) errorMessage = String(errObj.error);
        else if (errObj.statusText) errorMessage = String(errObj.statusText);
      }
      
      setError(errorMessage + '. Check browser console for full details.');
    }
  };

  const stopRecording = () => {
    if (vapi) {
      vapi.stop();
      if (transcript.trim()) {
        onTranscriptComplete(transcript.trim());
      }
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-orange-500/30 rounded-lg p-6">
      {/* Corner brackets */}
      <div className="absolute top-4 left-4 w-3 h-3 border-t-2 border-l-2 border-orange-500"></div>
      <div className="absolute top-4 right-4 w-3 h-3 border-t-2 border-r-2 border-orange-500"></div>
      <div className="absolute bottom-4 left-4 w-3 h-3 border-b-2 border-l-2 border-orange-500"></div>
      <div className="absolute bottom-4 right-4 w-3 h-3 border-b-2 border-r-2 border-orange-500"></div>

      <h2 className="text-xl font-bold text-orange-500 mb-4 flex items-center gap-2">
        <span className="text-2xl">🎤</span>
        Live Voice Input
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Status indicator */}
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-600'}`}></div>
          <span className="text-gray-300 text-sm">
            {isRecording ? (isSpeaking ? 'Listening...' : 'Ready to listen') : 'Not recording'}
          </span>
        </div>

        {/* Recording controls */}
        <div className="flex gap-3">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-orange-500/50"
            >
              Start Voice Call
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="flex-1 bg-red-600 text-white px-6 py-3 rounded font-semibold hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-red-500/50"
            >
              End Call & Analyze
            </button>
          )}
        </div>

        {/* Live transcript */}
        {transcript && (
          <div className="mt-4 p-4 bg-slate-900/50 border border-slate-700 rounded">
            <div className="text-xs text-gray-400 mb-2">LIVE TRANSCRIPT:</div>
            <div className="text-gray-200 text-sm font-mono leading-relaxed">
              {transcript}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-4 text-xs text-gray-500 space-y-1">
          <p>• Click &quot;Start Voice Call&quot; to begin recording</p>
          <p>• Speak clearly about the emergency situation</p>
          <p>• The AI assistant will ask clarifying questions</p>
          <p>• Click &quot;End Call &amp; Analyze&quot; when finished</p>
        </div>
      </div>
    </div>
  );
}
