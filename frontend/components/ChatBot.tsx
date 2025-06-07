'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { MessageSquare, X, Send, Volume2, VolumeX, Mic, MicOff } from 'lucide-react';
import { Button } from './buttons/Button';
import { useChat } from 'ai/react';
import { useRouter } from 'next/navigation';

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

type ChatBotProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ChatBot({ isOpen, onOpenChange }: ChatBotProps) {
  const [showNavigationConfirm, setShowNavigationConfirm] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [isTTSEnabled, setIsTTSEnabled] = useState(false);
  const [isSTTEnabled, setIsSTTEnabled] = useState(false);
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isClosingRef = useRef(false);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle chat open/close
  const handleOpenChange = useCallback((open: boolean) => {
    console.log('Dialog onOpenChange called with:', open);
    onOpenChange(open);
  }, [onOpenChange]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');

          // Check for wake word and commands, but only if we're not currently closing
          if (!isClosingRef.current && transcript.toLowerCase().includes('hey bueller')) {
            // Open chat if closed
            if (!isOpen) {
              onOpenChange(true);
            }

            // Extract message content after wake word
            const messageContent = transcript
              .toLowerCase()
              .replace('hey bueller', '')
              .trim();

            // If "send message" is detected, send the current input
            if (messageContent.includes('send message')) {
              const finalMessage = messageContent.replace('send message', '').trim();
              if (finalMessage) {
                setInput(finalMessage);
                // Use setTimeout to ensure the input is set before submitting
                setTimeout(() => {
                  const form = document.querySelector('form');
                  if (form) {
                    form.requestSubmit();
                    // Clear the input after submitting
                    setInput('');
                  }
                }, 0);
              }
            } else {
              // Update input with current transcript
              setInput(messageContent);
            }
          }
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          // Restart recognition if it stops due to an error
          if (isSTTEnabled && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (error) {
              console.error('Failed to restart speech recognition:', error);
            }
          }
        };

        recognitionRef.current.onend = () => {
          // Restart recognition if it was enabled
          if (isSTTEnabled && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (error) {
              console.error('Failed to restart speech recognition:', error);
            }
          }
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isSTTEnabled, isOpen, onOpenChange]);

  // Handle STT toggle
  const toggleSTT = useCallback(() => {
    if (recognitionRef.current) {
      if (!isSTTEnabled) {
        try {
          recognitionRef.current.start();
          setIsSTTEnabled(true);
        } catch (error) {
          console.error('Failed to start speech recognition:', error);
        }
      } else {
        recognitionRef.current.stop();
        setIsSTTEnabled(false);
      }
    }
  }, [isSTTEnabled]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

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
              console.log('Playing audio');
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
        <Dialog.Root open={isOpen} onOpenChange={handleOpenChange} modal={false}>
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
                    <Dialog.Close asChild>
                      <button
                        onClick={() => {
                          console.log('Close button clicked');
                          onOpenChange(false);
                        }}
                        className="text-gray-300 hover:text-white"
                      >
                        <X size={20} />
                      </button>
                    </Dialog.Close>
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
                      type="button"
                      onClick={toggleSTT}
                      className={`p-2 rounded-lg transition-colors ${
                        isSTTEnabled
                          ? 'bg-gray-700 text-white hover:bg-gray-600'
                          : 'text-gray-300 hover:text-white'
                      }`}
                      title={isSTTEnabled ? 'Disable STT' : 'Enable STT'}
                    >
                      {isSTTEnabled ? <Mic size={20} /> : <MicOff size={20} />}
                    </button>
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
      <audio ref={audioRef} className="hidden" />
    </>
  );
} 