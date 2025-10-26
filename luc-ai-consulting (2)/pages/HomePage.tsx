// FIX: Removed a conflicting /// <reference types="react" /> directive that was causing type resolution issues.
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
// FIX: The 'Waveform' icon does not exist in 'lucide-react'. Replaced with 'AudioWaveform'.
import { Send, Mic, MicOff, AlertTriangle, AudioWaveform } from 'lucide-react';
import VantaBackground from '../components/VantaBackground';
import AnimatedElement from '../components/AnimatedElement';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import LiquidOrb from '../components/LiquidOrb';


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


// Custom hook for prefers-reduced-motion
const usePrefersReducedMotion = () => {
    const [reducedMotion, setReducedMotion] = useState(false);
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReducedMotion(mediaQuery.matches);
        const handleChange = () => setReducedMotion(mediaQuery.matches);
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);
    return reducedMotion;
};

// Custom hook for responsive orb size
const useBreakpointSize = () => {
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth >= 1024) {
        setSize('lg');
      } else if (window.innerWidth >= 768) {
        setSize('md');
      } else {
        setSize('sm');
      }
    };
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
};


const HomePage: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'connecting' | 'active' | 'error'>('idle');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const prefersReducedMotion = usePrefersReducedMotion();
    const [isClientAndWebGL, setIsClientAndWebGL] = useState(false);
    const orbSize = useBreakpointSize();
    const [audioLevel, setAudioLevel] = useState(0);

    useEffect(() => {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl && gl instanceof WebGLRenderingContext) {
            setIsClientAndWebGL(true);
        }
    }, []);

    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const nextStartTimeRef = useRef<number>(0);
    const speakingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const inputAnalyserRef = useRef<AnalyserNode | null>(null);
    const outputAnalyserRef = useRef<AnalyserNode | null>(null);
    const animationFrameId = useRef<number | null>(null);
    
    useEffect(() => {
      const analyseAudio = () => {
          let level = 0;
          if (isSpeaking && outputAnalyserRef.current) {
              const dataArray = new Uint8Array(outputAnalyserRef.current.frequencyBinCount);
              outputAnalyserRef.current.getByteFrequencyData(dataArray);
              const sum = dataArray.reduce((acc, value) => acc + value, 0);
              level = (sum / dataArray.length) / 128.0; // Normalize and amplify
          } else if (status === 'active' && inputAnalyserRef.current) {
              const dataArray = new Uint8Array(inputAnalyserRef.current.frequencyBinCount);
              inputAnalyserRef.current.getByteFrequencyData(dataArray);
              const sum = dataArray.reduce((acc, value) => acc + value, 0);
              level = (sum / dataArray.length) / 128.0; // Normalize and amplify
          }
          
          setAudioLevel(level);
          animationFrameId.current = requestAnimationFrame(analyseAudio);
      };
  
      animationFrameId.current = requestAnimationFrame(analyseAudio);
  
      return () => {
          if (animationFrameId.current) {
              cancelAnimationFrame(animationFrameId.current);
          }
      };
    }, [status, isSpeaking]);

    const stopSession = useCallback(async () => {
        if (sessionPromiseRef.current) {
            try {
                const session = await sessionPromiseRef.current;
                session.close();
            } catch (e) {
                console.error("Error closing session:", e);
            }
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
        
        try {
            if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
                await inputAudioContextRef.current.close();
            }
        } catch (e) { console.error("Error closing input audio context:", e); }
        try {
            if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
                await outputAudioContextRef.current.close();
            }
        } catch (e) { console.error("Error closing output audio context:", e); }


        sourcesRef.current.forEach(source => source.stop());
        sourcesRef.current.clear();
        if(speakingTimeoutRef.current) clearTimeout(speakingTimeoutRef.current);

        inputAnalyserRef.current = null;
        outputAnalyserRef.current = null;
        setStatus('idle');
        setIsSpeaking(false);
    }, []);

    const startSession = useCallback(async () => {
        setStatus('connecting');
        setErrorMessage('');

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            
            // Setup analysers for audio visualization
            const inputAnalyser = inputAudioContextRef.current.createAnalyser();
            inputAnalyser.fftSize = 64;
            inputAnalyserRef.current = inputAnalyser;

            const outputAnalyser = outputAudioContextRef.current.createAnalyser();
            outputAnalyser.fftSize = 64;
            outputAnalyserRef.current = outputAnalyser;

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

            sessionPromiseRef.current = ai.live.connect({
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
                        // Connect audio graph: source -> analyser -> scriptProcessor -> destination
                        source.connect(inputAnalyser);
                        inputAnalyser.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContextRef.current!.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (base64Audio && outputAudioContextRef.current && outputAnalyserRef.current) {
                            const outputCtx = outputAudioContextRef.current;
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
                            
                            const sourceNode = outputCtx.createBufferSource();
                            sourceNode.buffer = audioBuffer;
                            
                            // Connect audio graph: source -> analyser -> destination
                            sourceNode.connect(outputAnalyserRef.current);
                            outputAnalyserRef.current.connect(outputCtx.destination);
                            
                            sourceNode.addEventListener('ended', () => {
                                sourcesRef.current.delete(sourceNode);
                            });

                            sourceNode.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                            sourcesRef.current.add(sourceNode);

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
                        setErrorMessage('Ein Fehler ist aufgetreten.');
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
                    systemInstruction: `LUC-AI Realtime Agent — System Identity & Context Memory

Agent Name: LUC
Organisation: LUC-AI Consulting
Rolle: Professioneller AI-Berater & Sprachassistent im Auftrag von Luca Ostellari.
Ton: professionell, sympathisch, ruhig-selbstbewusst, leicht cheeky (frech-smart).
Ziel: Unternehmen beim Einstieg in KI-gestützte Prozesse helfen – besonders im Bereich Marketing, Automatisierung und AI-Voice-Agents.

🧍‍♂️ ÜBER LUCA OSTELLARI

Luca Ostellari ist ein junger, innovativer Unternehmer aus Heidelberg.
Er baut aktuell ein Netzwerk aus AI-gestützten Business-Lösungen auf, darunter:

LUC-AI Consulting → maßgeschneiderte KI-Beratung & Voice-Automation für Firmen
Plan Yo Day → AI-basierter Zeit- und Produktivitätsplaner
BACARETO ART5.GG → erfolgreiches Gastronomie-Konzept mit starkem Branding
Chews & Never Fit → kreative Lifestyle- und Produkt-Brands

Er hat als Prokurist einer GmbH gearbeitet, mehrere Unternehmen mitgegründet
und versteht sowohl das operative Tagesgeschäft als auch die digitale Skalierung.

Luca steht für Effizienz, Mut zur Kreativität und echte Umsetzung statt PowerPoint.

🧩 AGENT-PERSONA

Selbstbild:

„Ich bin LUC, der persönliche Sprachagent von Luca Ostellari.
Ich spreche mit Kunden, erkenne ihr Interesse und unterstütze sie dabei,
KI-Lösungen in ihrem Unternehmen sinnvoll einzusetzen.“

Zielgruppe:

Kleine bis mittlere Unternehmen
Selbstständige, Start-Ups oder innovative Betriebe
Firmen, die offen sind für Automatisierung, aber keine „leeren Marketingversprechen“ wollen

Gesprächsstil:

Freundlich, aufmerksam, klar strukturiert
Kein aufdringlicher Sales-Talk
Stellt gezielte Fragen, um echtes Interesse zu erkennen
Gibt ehrliche, kompetente Einschätzungen („Das wäre für euch sinnvoll“, „Das lohnt sich wahrscheinlich nicht für euch“)
Zeigt Verständnis für Skepsis gegenüber AI und bietet Lösungen an, die Vertrauen schaffen

🗣️ BEGRÜSSUNG (Voice Agent Beispiel)

„Hallo! Ich bin LUC – der persönliche Sprachassistent von Luca Ostellari bei LUC-AI Consulting.
Wir helfen Unternehmen, KI sinnvoll einzusetzen – zum Beispiel mit intelligenten Voice-Sekretären oder Automatisierungen,
die Zeit sparen und Abläufe schlanker machen.
Darf ich kurz fragen, mit wem ich spreche und für welches Unternehmen Sie arbeiten?“

🧾 DATENAUFNAHME & DOUBLE-CHECK ROUTINE

Wenn der Agent Kundendaten erfragt (z. B. Name, Telefonnummer, E-Mail, Firma), führt er IMMER einen Double-Check durch:

Wiederholt jede Information in eigenen Worten:

„Nur um sicherzugehen – ich habe verstanden: Ihre E-Mail lautet luca@luc-ai.com
, richtig?“

Fragt bei Unklarheit nach, bevor die Daten gespeichert oder übermittelt werden.

Speichert Daten temporär nur, wenn der Nutzer bestätigt hat, dass sie korrekt sind.

Bestätigt abschließend, welche Daten zusammengetragen wurden:

„Perfekt, ich habe: Luca Ostellari – luca@luc-ai.com
 – LUC-AI Consulting. Stimmt das so?“

💼 ANGEBOTSLOGIK & SALES-ETHIK

Der Service wird zunächst kostenlos für 2 Wochen installiert, um Vertrauen zu schaffen.
Danach wird nur abgerechnet, wenn das Unternehmen den Agenten behalten möchte.
Preise sind Premium, aber der Nutzen übersteigt die Kosten deutlich
(Zeitersparnis, Umsatzsteigerung, Reduktion von Personalkosten, 24/7-Support).
Keine Überredung. Nur überzeugte Kunden werden betreut.
Agenten dürfen erklären, warum das System so funktioniert, aber nie Druck ausüben.
Motto: „Wir wollen nicht die lautesten sein – sondern die, die liefern.“

🧠 INTELLIGENZ & REAKTION

Der Agent erkennt automatisch folgende Situationen:
Skepsis oder Zweifel: → Ruhig, sachlich, mit Beispielen antworten („Ich verstehe die Sorge. Viele denken zuerst an Aufwand, aber wir bauen alles so, dass Sie nichts extra tun müssen.“)
Interesse: → Schnell, freundlich die Vorteile erklären, die genau zur Branche passen.
Ablehnung oder Desinteresse: → Gespräch wertschätzend beenden („Kein Problem, vielleicht später. Ich wünsche einen erfolgreichen Tag!“)
Fragen zu Luca oder der Agentur: → Kurz erzählen, wer Luca ist (jung, innovativ, Hands-on, versteht Marketing und Automation besser als klassische Agenturen).

🧰 TECHNISCHES VERHALTEN

Beim Start jeder Sitzung: → Lade LUC_AI_PROFILE.md und aktiviere Kontext über system_memory. → Setze Persona-Variablen (agent_role, agent_tone, business_context).
Reagiere in Deutsch (Standard), aber erkenne Englisch automatisch.
Falls Kunde Sprache wechselt → Passe Antwortsprache dynamisch an.
Alle Gespräche laufen kontextbewusst, d. h. vorherige Kundenangaben bleiben für die aktuelle Session aktiv.

⚡ KURZE MISSION-ZUSAMMENFASSUNG

LUC-AI Consulting steht für die nächste Generation von KI-Dienstleistungen:
Junge Energie, echtes Verständnis für moderne Unternehmen und mutige,
kreative Umsetzung. Kein Blabla, kein Copy-Paste-Marketing – sondern
clevere Automatisierung, die Geld spart oder Umsatz generiert.

LUC steht für: Listening, Understanding, Consulting.`,
                },
            });

        } catch (err) {
            console.error('Failed to start session:', err);
            setErrorMessage('Mikrofonzugriff wurde verweigert.');
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

    const orbVisualState = isSpeaking ? 'speaking' : (status === 'active' ? 'listening' : 'idle');

    return (
        <>
            <VantaBackground />
            
            {/* Hero Section */}
            <section className="relative container mx-auto px-6 py-24 md:py-40 text-center flex flex-col items-center">
                <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight text-light-100 hero-title relative z-20">
                    AI, die <span className="gradient-text">spricht</span>, <span className="gradient-text">denkt</span> und <span className="gradient-text">verkauft</span> – für dein Business.
                </h1>

                <div 
                    data-orb-slot
                    className="relative h-[480px] md:h-[624px] lg:h-[768px] w-full flex items-center justify-center mt-[-140px] md:mt-[-182px] lg:mt-[-224px] mb-[-124px] md:mb-[-166px] lg:mb-[-208px] z-10"
                    style={{ background: 'radial-gradient(ellipse at center, transparent 30%, #0A0A0A 80%)' }}
                >
                   {isClientAndWebGL && <LiquidOrb size={orbSize} status={orbVisualState} audioLevel={audioLevel} />}
                   
                   <button
                        onClick={handleToggleSession}
                        role="button"
                        aria-pressed={status === 'active'}
                        aria-label={status === 'active' ? 'Mikrofon stumm' : 'Mikrofon aktiv'}
                        className="absolute bottom-3 right-3 z-30 w-11 h-11 md:w-12 md:h-12 rounded-full bg-dark-800/50 backdrop-blur-sm border border-white/10 flex items-center justify-center cursor-pointer hover:border-white/20 hover:bg-dark-800/70 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        {isSpeaking ? (
                            // FIX: The 'Waveform' icon does not exist in 'lucide-react'. Replaced with 'AudioWaveform'.
                            <AudioWaveform size={20} className="text-primary animate-pulse" />
                        ) : status === 'active' || status === 'connecting' ? (
                            <Mic size={20} className="text-white/90" />
                        ) : (
                            <MicOff size={20} className="text-white/60" />
                        )}
                    </button>
                </div>

                <div className="relative z-20 h-20 flex flex-col items-center justify-center hero-button">
                    <button 
                        onClick={handleToggleSession}
                        disabled={status === 'connecting'}
                        aria-disabled={status === 'active'}
                        className="bg-primary hover:bg-primary/90 text-white font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-primary/40 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                    >
                       {status === 'connecting' ? 'Verbinde...' : (status === 'active' ? 'Orb läuft ✨' : 'Orb starten')}
                    </button>
                    <div className="absolute top-full mt-2 text-center text-xs text-light-400 min-h-[20px]">
                       {status === 'error' && (
                            <p className="text-red-500 flex items-center justify-center animate-fadeIn"><AlertTriangle size={14} className="mr-1"/>{errorMessage}</p>
                        )}
                    </div>
                </div>
            </section>
            
            {/* About Section */}
            <section className="bg-dark-900 py-20">
              <div className="container mx-auto px-6 max-w-4xl">
                <AnimatedElement className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Über mich</h2>
                   <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto"></div>
                </AnimatedElement>
                <AnimatedElement>
                  <div className="bg-dark-800 p-8 md:p-12 rounded-2xl border border-dark-700 shadow-2xl shadow-primary/10 card-hover">
                    <p className="text-xl md:text-2xl leading-relaxed text-light-200 text-center">
                      Ich bin <span className="font-semibold gradient-text">LUCA</span>, und ich zeige Heidelberger Businesses, wie sie mit KI mehr Geld verdienen – und wie sie im KI-Ansturm nicht untergehen, sondern gewinnen.
                    </p>
                  </div>
                </AnimatedElement>
              </div>
            </section>

            {/* Contact Section */}
            <ContactSection />
        </>
    );
};


const ContactSection = () => {
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('sending');
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setStatus('success');
        (e.target as HTMLFormElement).reset();
        setTimeout(() => setStatus('idle'), 5000);
    };

    return (
        <section id="contact" className="bg-dark-900 py-20">
            <div className="container mx-auto px-6 max-w-3xl">
                <AnimatedElement className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Kontakt für persönliches Gespräch</h2>
                     <p className="text-light-400 max-w-2xl mx-auto">
                        Hinterlasse deine Daten, um einen <span className="gradient-text font-semibold">kostenlosen persönlichen</span> Termin zu vereinbaren.
                    </p>
                </AnimatedElement>
                <AnimatedElement>
                    <div className="bg-dark-800 p-8 rounded-2xl shadow-2xl shadow-primary/10 border border-dark-700 card-hover">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label htmlFor="name" className="block text-light-200 mb-2 font-medium">Name *</label>
                                <input type="text" id="name" name="name" required className="w-full px-4 py-3 bg-dark-700 border border-dark-700/50 text-light-100 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition" />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="company" className="block text-light-200 mb-2 font-medium">Unternehmen</label>
                                <input type="text" id="company" name="company" className="w-full px-4 py-3 bg-dark-700 border border-dark-700/50 text-light-100 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition" />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="email" className="block text-light-200 mb-2 font-medium">E-Mail *</label>
                                <input type="email" id="email" name="email" required className="w-full px-4 py-3 bg-dark-700 border border-dark-700/50 text-light-100 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition" />
                            </div>
                            <div className="mb-8">
                                <label htmlFor="phone" className="block text-light-200 mb-2 font-medium">Telefonnummer</label>
                                <input type="tel" id="phone" name="phone" className="w-full px-4 py-3 bg-dark-700 border border-dark-700/50 text-light-100 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition" />
                            </div>
                            <button type="submit" disabled={status === 'sending'} className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-full transition-all transform hover:scale-[1.02] disabled:bg-primary/50 flex items-center justify-center">
                                <Send size={20} className="mr-2" />
                                {status === 'sending' ? 'Sende...' : 'Jetzt kontaktieren'}
                            </button>
                             <div className="mt-4 text-center min-h-[24px] text-sm">
                                {status === 'success' && <p className="text-green-500">Vielen Dank! Ich melde mich bald bei dir.</p>}
                                {status === 'error' && <p className="text-red-500">Fehler beim Senden. Bitte versuche es erneut.</p>}
                            </div>
                        </form>
                    </div>
                </AnimatedElement>
            </div>
        </section>
    );
};


export default HomePage;