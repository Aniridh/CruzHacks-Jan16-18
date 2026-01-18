'use client';

import { useState, useEffect } from 'react';
import Vapi from '@vapi-ai/web';

interface VoiceRecorderProps {
  onTranscriptComplete: (transcript: string) => void;
}

export default function VoiceRecorder({ onTranscriptComplete }: VoiceRecorderProps) {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize Vapi
    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    
    if (!publicKey) {
      setError('Vapi API key not configured. Please add NEXT_PUBLIC_VAPI_PUBLIC_KEY to .env.local');
      return;
    }

    const vapiInstance = new Vapi(publicKey);
    setVapi(vapiInstance);

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

    vapiInstance.on('message', (message: any) => {
      console.log('Message received:', message);
      
      // Handle transcript updates
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        setTranscript((prev) => prev + ' ' + message.transcript);
      }
    });

    vapiInstance.on('error', (error: any) => {
      console.error('Vapi error:', error);
      setError(error.message || 'An error occurred with voice recording');
      setIsRecording(false);
    });

    return () => {
      vapiInstance.stop();
    };
  }, []);

  const startRecording = async () => {
    if (!vapi) {
      setError('Voice system not initialized');
      return;
    }

    try {
      setTranscript('');
      setError(null);
      
      // Start a call with Vapi assistant
      await vapi.start({
        transcriber: {
          provider: 'deepgram',
          model: 'nova-2',
          language: 'en-US',
        },
        model: {
          provider: 'openai',
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an emergency call responder. Listen carefully to the caller describing a fire emergency. Ask clarifying questions about the location, fire origin, visible hazards, and any blocked exits. Keep responses brief and focused on gathering critical information.',
            },
          ],
        },
        voice: {
          provider: 'playht',
          voiceId: 'jennifer',
        },
      });
    } catch (err) {
      console.error('Error starting recording:', err);
      setError(err instanceof Error ? err.message : 'Failed to start recording');
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
          <p>• Click "Start Voice Call" to begin recording</p>
          <p>• Speak clearly about the emergency situation</p>
          <p>• The AI assistant will ask clarifying questions</p>
          <p>• Click "End Call & Analyze" when finished</p>
        </div>
      </div>
    </div>
  );
}
