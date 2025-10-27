// FIX: Removed a conflicting /// <reference types="react" /> directive that was causing type resolution issues.
import React, { useState, useRef, useCallback, useEffect } from 'react';
// FIX: Removed non-exported 'LiveSession' type from @google/genai import.
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { Mic, MicOff, AlertTriangle } from 'lucide-react';

// Audio processing helper functions
function encode(bytes: Uint8Array): string {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function decode(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}

const AIAgentOrb: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'connecting' | 'active' | 'error'>('idle');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // FIX: Replaced 'LiveSession' with 'any' as the type is not exported from the SDK.
    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const nextStartTimeRef = useRef<number>(0);
    // FIX: Use ReturnType<typeof setTimeout> for browser-compatible timer ID type.
    const speakingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    
    const stopSession = useCallback(async () => {
        if (sessionPromiseRef.current) {
            const session = await sessionPromiseRef.current;
            session.close();
            sessionPromiseRef.current = null;
        }

        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.disconnect();
            scriptProcessorRef.current = null;
        }

        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }

        if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
            await inputAudioContextRef.current.close();
        }
        if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
            await outputAudioContextRef.current.close();
        }

        sourcesRef.current.forEach(source => source.stop());
        sourcesRef.current.clear();

        setStatus('idle');
        setIsSpeaking(false);
    }, []);

    const startSession = useCallback(async () => {
        setStatus('connecting');
        setErrorMessage('');

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            // FIX: Add `(window as any)` to support vendor-prefixed `webkitAudioContext` for older browsers.
            inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            // FIX: Add `(window as any)` to support vendor-prefixed `webkitAudioContext` for older browsers.
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

            sessionPromiseRef.current = ai.live.connect({
                // FIX: Corrected model name from '...-2505' to '...-2025' per documentation.
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        setStatus('active');
                        const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
                        const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current = scriptProcessor;

                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const l = inputData.length;
                            const int16 = new Int16Array(l);
                            for (let i = 0; i < l; i++) {
                                int16[i] = inputData[i] * 32768;
                            }
                            const pcmBlob: Blob = {
                                data: encode(new Uint8Array(int16.buffer)),
                                mimeType: 'audio/pcm;rate=16000',
                            };
                            sessionPromiseRef.current?.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContextRef.current!.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (base64Audio && outputAudioContextRef.current) {
                            const outputCtx = outputAudioContextRef.current;
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
                            
                            const source = outputCtx.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputCtx.destination);
                            
                            source.addEventListener('ended', () => {
                                sourcesRef.current.delete(source);
                            });

                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                            sourcesRef.current.add(source);

                            setIsSpeaking(true);
                            if (speakingTimeoutRef.current) clearTimeout(speakingTimeoutRef.current);
                            const timeUntilEnd = (nextStartTimeRef.current - outputCtx.currentTime) * 1000;
                            speakingTimeoutRef.current = setTimeout(() => {
                                setIsSpeaking(false);
                            }, timeUntilEnd + 200);
                        }

                        if (message.serverContent?.interrupted) {
                            sourcesRef.current.forEach(source => source.stop());
                            sourcesRef.current.clear();
                            nextStartTimeRef.current = 0;
                            setIsSpeaking(false);
                            if(speakingTimeoutRef.current) clearTimeout(speakingTimeoutRef.current);
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Session error:', e);
                        setErrorMessage('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
                        setStatus('error');
                        stopSession();
                    },
                    onclose: () => {
                        stopSession();
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                },
            });

        } catch (err) {
            console.error('Failed to start session:', err);
            setErrorMessage('Mikrofonzugriff verweigert oder nicht verfügbar.');
            setStatus('error');
        }
    }, [stopSession]);

    useEffect(() => {
        return () => {
            stopSession();
        };
    }, [stopSession]);

    const handleToggleSession = () => {
        if (status === 'active' || status === 'connecting') {
            stopSession();
        } else {
            startSession();
        }
    };
    
    const orbClasses = `ai-orb ${status === 'active' ? 'listening' : ''} ${isSpeaking ? 'speaking' : ''}`;
    const getButtonText = () => {
        if (status === 'connecting') return 'Verbinde...';
        if (status === 'active') return 'Gespräch beenden';
        return 'Gespräch starten';
    }

    return (
        <div className="flex flex-col items-center justify-center gap-8">
            <div className={orbClasses} onClick={handleToggleSession} role="button" aria-label="Start or stop AI conversation">
                <div className="ai-orb-liquid" />
                 <div className="absolute inset-0 flex items-center justify-center z-10">
                    {status === 'active' || status === 'connecting' ? <Mic size={60} className="text-white/80" /> : <MicOff size={60} className="text-white/50" />}
                </div>
            </div>
            <button onClick={handleToggleSession} className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 w-64 text-center">
                {getButtonText()}
            </button>
            {status === 'error' && (
                 <p className="text-red-500 flex items-center justify-center mt-2"><AlertTriangle size={16} className="mr-2"/>{errorMessage}</p>
            )}
        </div>
    );
};

export default AIAgentOrb;