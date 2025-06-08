'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { MessageSquare, X, Send, Volume2, VolumeX, Mic, MicOff } from 'lucide-react';
import { Button } from './buttons/Button';
import { useChat } from 'ai/react';
import { useRouter } from 'next/navigation';
import { useChatStore } from '../store/chatStore';

// Add type declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
  interpretation: unknown;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionError extends Event {
  error: string;
  message: string;
}

type SpeechRecognitionEventHandler = (this: SpeechRecognition, ev: Event) => void;
type SpeechRecognitionErrorEventHandler = (this: SpeechRecognition, ev: SpeechRecognitionError) => void;
type SpeechRecognitionResultEventHandler = (this: SpeechRecognition, ev: SpeechRecognitionEvent) => void;

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onaudioend: SpeechRecognitionEventHandler | null;
  onaudiostart: SpeechRecognitionEventHandler | null;
  onend: SpeechRecognitionEventHandler | null;
  onerror: SpeechRecognitionErrorEventHandler | null;
  onnomatch: SpeechRecognitionEventHandler | null;
  onresult: SpeechRecognitionResultEventHandler | null;
  onsoundend: SpeechRecognitionEventHandler | null;
  onsoundstart: SpeechRecognitionEventHandler | null;
  onspeechend: SpeechRecognitionEventHandler | null;
  onspeechstart: SpeechRecognitionEventHandler | null;
  onstart: SpeechRecognitionEventHandler | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

const welcomeMessage = {
  id: 'welcome',
  role: 'assistant' as const,
  content: `Hi! I'm Bueller, an AI assistant for this portfolio site. I was built by Henry Pharris using vercels AI SDK and OpenAI's GPT 3.5-Turbo model & api. I can help you:

• Navigate through different sections (About, Projects, Contact, etc)
• Find specific projects or information
• Answer questions about the portfolio
• Guide you to relevant pages

How can I help you today?`
};

type Message = {
  id?: string;
  role: string;
  content: string;
};

interface ChatBotProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function ChatBot({ isOpen, onOpenChange, onSubmit }: ChatBotProps) {
  const [showNavigationConfirm, setShowNavigationConfirm] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [isTTSEnabled, setIsTTSEnabled] = useState(false);
  const { isRecording, setIsRecording, isTranscribing, setIsTranscribing } = useChatStore();
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isClosingRef = useRef(false);
  const isTranscribingRef = useRef(false);
  const isRecordingRef = useRef(false);
  const [transcript, setTranscript] = useState('');
  const [trimmedTranscript, setTrimmedTranscript] = useState('');
  const [countdown, setCountdown] = useState(10);
  const countdownRef = useRef<NodeJS.Timeout>();
  const isResettingRef = useRef(false);
  const transcriptionStartIndexRef = useRef<number>(0);
  const commandWindowRef = useRef(false);
  const lastStateChangeRef = useRef<number>(0);
  const STATE_CHANGE_DEBOUNCE = 500; // ms
  const isRecognitionActiveRef = useRef(false);

  // Sync refs with state
  useEffect(() => {
    isTranscribingRef.current = isTranscribing;
  }, [isTranscribing]);

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle chat open/close
  useEffect(() => {
    if (isOpen) {
      // Reset states when opening chat
      setTranscript('');
      setTrimmedTranscript('');
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          setTimeout(() => {
            if (recognitionRef.current) {
              recognitionRef.current.start();
            }
          }, 100);
        } catch (error) {
          console.error('Error resetting recognition on chat open:', error);
        }
      }
    } else {
      // Reset states when closing chat
      setTranscript('');
      setTrimmedTranscript('');
      setInput('');
      isTranscribingRef.current = false;
      setIsTranscribing(false);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error('Error stopping recognition on chat close:', error);
        }
      }
    }
  }, [isOpen]);

  // Add a function to safely update state
  const safeSetState = useCallback((newState: boolean, stateType: 'recording' | 'transcribing') => {
    const now = Date.now();
    if (now - lastStateChangeRef.current < STATE_CHANGE_DEBOUNCE) {
      console.log(`Skipping ${stateType} state change - too soon after last change`);
      return;
    }
    
    lastStateChangeRef.current = now;
    if (stateType === 'recording') {
      isRecordingRef.current = newState;
      setIsRecording(newState);
    } else {
      isTranscribingRef.current = newState;
      setIsTranscribing(newState);
    }
  }, []);

  // Add a function to safely start recognition
  const startRecognition = useCallback(() => {
    if (!recognitionRef.current || isRecordingRef.current) return;
    
    try {
      recognitionRef.current.start();
      isRecordingRef.current = true;
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recognition:', error);
      isRecordingRef.current = false;
      setIsRecording(false);
    }
  }, []);

  // Add a function to safely stop recognition
  const stopRecognition = useCallback(() => {
    if (!recognitionRef.current || !isRecordingRef.current) return;
    
    try {
      recognitionRef.current.stop();
      isRecordingRef.current = false;
      setIsRecording(false);
      isTranscribingRef.current = false;
      setIsTranscribing(false);
    } catch (error) {
      console.error('Error stopping recognition:', error);
    }
  }, []);

  // Add a function to reset recognition
  const resetRecognition = useCallback(() => {
    if (!recognitionRef.current) return;
    
    try {
      // Stop recognition if it's active
      if (isRecordingRef.current) {
        recognitionRef.current.stop();
        isRecordingRef.current = false;
        setIsRecording(false);
      }
      
      // Clear all transcripts
      setTranscript('');
      setTrimmedTranscript('');
      setInput('');
      
      // Start recognition again
      setTimeout(() => {
        try {
          recognitionRef.current?.start();
          isRecordingRef.current = true;
          setIsRecording(true);
        } catch (error) {
          console.error('Error restarting recognition:', error);
        }
      }, 100);
    } catch (error) {
      console.error('Error resetting recognition:', error);
    }
  }, []);

  // Handle recording toggle
  const toggleRecording = useCallback(() => {
    console.log('Toggle recording clicked, current state:', isRecordingRef.current);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!isRecordingRef.current) {
      // Starting recording
      if (SpeechRecognition) {
        try {
          // Create new recognition instance
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.continuous = true;
          recognitionRef.current.interimResults = true;
          recognitionRef.current.lang = 'en-US';

          // Set up event handlers
          recognitionRef.current.onend = () => {
            // Restart recognition if we're still supposed to be recording
            if (isRecordingRef.current) {
              startRecognition();
            } else {
              // Ensure UI is in sync if we're not supposed to be recording
              setIsRecording(false);
              setIsTranscribing(false);
            }
          };

          recognitionRef.current.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            
            // For no-speech errors, we should stop recording and update UI
            if (event.error === 'no-speech') {
              isRecordingRef.current = false;
              setIsRecording(false);
              isTranscribingRef.current = false;
              setIsTranscribing(false);
              return;
            }
            
            // For other errors, try to restart if we're still supposed to be recording
            if (isRecordingRef.current) {
              startRecognition();
            } else {
              // Ensure UI is in sync if we're not supposed to be recording
              setIsRecording(false);
              setIsTranscribing(false);
            }
          };

          recognitionRef.current.onresult = (event) => {
            // Get all results for the base transcript
            const allResults = Array.from(event.results)
              .map(result => result[0].transcript)
              .join('')
              .toLowerCase();

            // Update base transcript
            setTranscript(allResults);

            // Handle wake words and commands using the full transcript
            if (allResults) {
              if (allResults.includes('hey bueller') || allResults.includes('hello bueller')) {
                onOpenChange(true);
                resetRecognition();
                return;
              }

              if (allResults.includes('goodbye bueller') || allResults.includes('bye bueller') || allResults.includes('close bueller')) {
                onOpenChange(false);
                resetRecognition();
                return;
              }

              // Process message commands if chat is open
              if (isOpen) {
                // Check for start message command first
                if (!isTranscribingRef.current && (allResults.includes('start message') || allResults.includes('start a message') || allResults.includes('begin message'))) {
                  resetRecognition();
                  isTranscribingRef.current = true;
                  setIsTranscribing(true);
                  return;
                }

                // Check for send message command
                if (isTranscribingRef.current && (allResults.includes('send message') || allResults.includes('send a message'))) {
                  const form = document.querySelector('form');
                  if (form) {
                    form.dispatchEvent(new Event('submit', { bubbles: true }));
                  }
                  resetRecognition();
                  isTranscribingRef.current = false;
                  setIsTranscribing(false);
                  return;
                }

                // Check for reset message command
                if (isTranscribingRef.current && (allResults.includes('reset message') || allResults.includes('clear message'))) {
                  resetRecognition();
                  isTranscribingRef.current = false;
                  setIsTranscribing(false);
                  return;
                }
              }
            }

            // Update input if we're in transcribing mode
            if (isTranscribingRef.current) {
              // Get all results since we started transcribing
              const relevantResults = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('')
                .toLowerCase();

              if (relevantResults) {
                // Clean commands and wake words from the transcript for input
                const cleanTranscript = relevantResults
                  .replace(/hey bueller|hello bueller|goodbye bueller|bye bueller|close bueller|start message|start a message|begin message|send message|send a message|reset message|clear message/gi, '')
                  .trim();

                if (cleanTranscript) {
                  setTrimmedTranscript(cleanTranscript);
                  setInput(cleanTranscript);
                }
              }
            }
          };

          // Start recognition
          startRecognition();
        } catch (error) {
          console.error('Error setting up speech recognition:', error);
          isRecordingRef.current = false;
          setIsRecording(false);
        }
      }
    } else {
      // Stopping recording
      stopRecognition();
    }
  }, [isOpen, onOpenChange, resetRecognition, startRecognition, stopRecognition]);

  // Add cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error('Error stopping recognition on cleanup:', error);
        }
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    isTranscribingRef.current = false;
    setIsTranscribing(false);

    try {
      // Get chat response
      const chatRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!chatRes.ok) throw new Error('Chat request failed');
      
      // Add assistant message with empty content
      const assistantMessage = { role: 'assistant', content: '' };
      setMessages(prev => [...prev, assistantMessage]);

      // Handle streaming response
      const reader = chatRes.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          fullContent += chunk;

          // Update the last message with the new content
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = {
              ...newMessages[newMessages.length - 1],
              content: fullContent,
            };
            return newMessages;
          });
        }
      }

      // Handle TTS if enabled
      if (isTTSEnabled) {
        try {
          const ttsRes = await fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: fullContent }),
          });

          if (!ttsRes.ok) throw new Error('TTS request failed');

          // Create a MediaSource
          const mediaSource = new MediaSource();
          const audioUrl = URL.createObjectURL(mediaSource);
          
          if (audioRef.current) {
            // Clean up previous audio URL
            if (audioRef.current.src) {
              URL.revokeObjectURL(audioRef.current.src);
            }
            
            audioRef.current.src = audioUrl;
            
            // Wait for MediaSource to be ready
            await new Promise((resolve) => {
              mediaSource.addEventListener('sourceopen', resolve, { once: true });
            });

            // Create a SourceBuffer
            const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');
            
            // Handle streaming audio data
            const reader = ttsRes.body?.getReader();
            if (reader) {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                // Append the chunk to the SourceBuffer
                await new Promise((resolve) => {
                  sourceBuffer.addEventListener('updateend', resolve, { once: true });
                  sourceBuffer.appendBuffer(value);
                });
              }
            }

            // End the stream
            mediaSource.endOfStream();
            
            try {
              await audioRef.current.play();
            } catch (playError) {
              console.error('Error playing audio:', playError);
            }
          }
        } catch (error) {
          console.error('TTS Error:', error);
        }
      }

      // Check for navigation
      const navigationMatch = fullContent.match(/^Navigating you to (?:project )?(\d+|\/\w+|\w+)/i);
      if (navigationMatch) {
        const path = extractNavigationPath(navigationMatch[0]);
        if (path) {
          setPendingNavigation(path);
          setShowNavigationConfirm(true);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const extractNavigationPath = (content: string): string | null => {
    const navigationPatterns = [
      { pattern: /^Navigating you to (\/\w+)/i, path: '$1' },
      { pattern: /^Navigating you to (about)/i, path: '/about' },
      { pattern: /^Navigating you to (projects)/i, path: '/projects' },
      { pattern: /^Navigating you to (admin)/i, path: '/admin' },
      // Project-specific navigation patterns
      { pattern: /^Navigating you to project (\d+)/i, path: (match: RegExpMatchArray) => `/projects/${match[1]}` }
    ];

    for (const { pattern, path } of navigationPatterns) {
      const match = content.match(pattern);
      if (match) {
        if (typeof path === 'function') {
          return path(match);
        }
        return path.startsWith('/') ? path : `/${path}`;
      }
    }
    return null;
  };

  const handleNavigation = () => {
    if (pendingNavigation) {
      onOpenChange(false);
      setShowNavigationConfirm(false);
      setPendingNavigation(null);
      router.push(pendingNavigation);
    }
  };

  const cancelNavigation = () => {
    setShowNavigationConfirm(false);
    setPendingNavigation(null);
  };

  // Add welcome message when chat is first opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message
      const welcomeEvent = new CustomEvent('ai:message', {
        detail: welcomeMessage
      });
      window.dispatchEvent(welcomeEvent);
    }
  }, [isOpen, messages.length]);

  // Handle TTS
  useEffect(() => {
    if (!isTTSEnabled) return;

    const handleMessage = async (event: Event) => {
      const customEvent = event as CustomEvent<{ role: string; content: string }>;
      const message = customEvent.detail;
      if (message.role === 'assistant') {
        try {
          console.log('Sending TTS request for:', message.content);
          const response = await fetch(`/api/chat?text=${encodeURIComponent(message.content)}`);

          if (!response.ok) {
            const errorText = await response.text();
            console.error('TTS request failed:', errorText);
            throw new Error(`TTS request failed: ${errorText}`);
          }
          
          const audioBlob = await response.blob();
          console.log('Received audio blob:', audioBlob.size, 'bytes');
          
          if (audioBlob.size === 0) {
            console.error('Received empty audio blob');
            return;
          }

          const audioUrl = URL.createObjectURL(audioBlob);
          
          if (audioRef.current) {
            // Clean up previous audio URL
            if (audioRef.current.src) {
              URL.revokeObjectURL(audioRef.current.src);
            }
            
            audioRef.current.src = audioUrl;
            
            try {
              await audioRef.current.play();
              console.log('Playing audio');
            } catch (playError) {
              console.error('Error playing audio:', playError);
            }
          }
        } catch (error) {
          console.error('Error in TTS handling:', error);
        }
      }
    };

    window.addEventListener('ai:message', handleMessage);
    return () => {
      window.removeEventListener('ai:message', handleMessage);
      if (audioRef.current) {
        audioRef.current.pause();
        if (audioRef.current.src) {
          URL.revokeObjectURL(audioRef.current.src);
        }
        audioRef.current.src = '';
      }
    };
  }, [isTTSEnabled]);

  // Handle countdown timer
  useEffect(() => {
    if (showNavigationConfirm) {
      setCountdown(10);
      countdownRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownRef.current);
            handleNavigation();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    }

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [showNavigationConfirm]);

  return (
    <>
      <Button 
        variant="nav" 
        onClick={(e: React.MouseEvent) => {
          console.log('Button clicked, current state:', isOpen);
          e.preventDefault();
          e.stopPropagation();
          onOpenChange(!isOpen);
        }}
      >
        <MessageSquare className="h-5 w-5" />
      </Button>
      {isOpen && (
        <Dialog.Root open={isOpen} modal={false}>
          <Dialog.Portal>
            <Dialog.Overlay className="hidden" />
            <Dialog.Content 
              className="fixed top-[88px] right-4 bottom-4 w-full max-w-md bg-gray-800/30 backdrop-blur-md shadow-xl z-[101] rounded-xl transform transition-all duration-500 ease-in-out translate-x-full data-[state=open]:translate-x-0 overflow-hidden"
              onPointerDownOutside={(e) => e.preventDefault()}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-gray-200/50 bg-gray-800 rounded-t-xl">
                  <Dialog.Title className="text-xl font-bold text-white">"Bueller" the AI Chat Assistant</Dialog.Title>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsTTSEnabled(!isTTSEnabled)}
                      className={`p-2 rounded-lg transition-colors ${
                        isTTSEnabled
                          ? 'bg-gray-700 text-white hover:bg-gray-600'
                          : 'text-gray-300 hover:text-white'
                      }`}
                      title={isTTSEnabled ? 'Disable TTS' : 'Enable TTS'}
                    >
                      {isTTSEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    </button>
                    <button
                      type="button"
                      onClick={toggleRecording}
                      className={`p-2 rounded-lg transition-colors ${
                        isRecording
                          ? 'bg-gray-700 text-white hover:bg-gray-600'
                          : 'text-gray-300 hover:text-white'
                      }`}
                      title={isRecording ? 'Disable Voice Input' : 'Enable Voice Input'}
                    >
                      {isRecording ? <Mic size={20} /> : <MicOff size={20} />}
                    </button>
                    <button
                      onClick={() => {
                        console.log('Close button clicked');
                        onOpenChange(false);
                      }}
                      className="text-gray-300 hover:text-white"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/30 backdrop-blur-md">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === 'assistant' ? 'justify-start' : 'justify-end'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === 'assistant'
                            ? 'bg-gray-700 text-white'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200/50 bg-gray-800 rounded-b-xl">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </form>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
      {showNavigationConfirm && (
        <Dialog.Root open={showNavigationConfirm} modal={true}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[102]" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800/90 backdrop-blur-md p-6 rounded-xl shadow-xl z-[103] w-full max-w-md">
              <Dialog.Title className="text-xl font-bold text-white mb-4">
                Navigate to {pendingNavigation}?
              </Dialog.Title>
              <p className="text-gray-300 mb-6">
                Auto-navigating in {countdown} seconds...
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={cancelNavigation}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNavigation}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Navigate Now
                </button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
      <audio ref={audioRef} className="hidden" />
    </>
  );
} 