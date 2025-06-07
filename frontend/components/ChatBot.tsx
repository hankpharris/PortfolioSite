'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { MessageSquare, X, Send, Mic, MicOff } from 'lucide-react';
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

type ChatBotProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ChatBot({ isOpen, onOpenChange }: ChatBotProps) {
  const [showNavigationConfirm, setShowNavigationConfirm] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const { isRecording, setIsRecording, isTranscribing, setIsTranscribing } = useChatStore();
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

  // Handle recording toggle
  const toggleRecording = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!isRecording) {
      // Starting recording
      if (SpeechRecognition) {
        try {
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.continuous = true;
          recognitionRef.current.interimResults = true;
          recognitionRef.current.lang = 'en-US';

          recognitionRef.current.onresult = (event) => {
            const transcript = Array.from(event.results)
              .map(result => result[0].transcript)
              .join('')
              .toLowerCase();

            console.log('Speech recognized:', transcript, 'Recording:', isRecording, 'Transcribing:', isTranscribing, 'Chat Open:', isOpen);

            // Handle wake words and commands
            if (transcript.includes('hey bueller') || transcript.includes('hello bueller')) {
              onOpenChange(true);
              return;
            }

            if (transcript.includes('goodbye bueller') || transcript.includes('bye bueller') || transcript.includes('close bueller')) {
              onOpenChange(false);
              return;
            }

            // Process message commands if chat is open
            if (isOpen) {
              if (transcript.includes('start message') || transcript.includes('start a message') || transcript.includes('begin message')) {
                setInput('');
                setIsTranscribing(true);
                return;
              }

              if (transcript.includes('send message') || transcript.includes('send a message')) {
                if (input.trim()) {
                  const form = document.querySelector('form');
                  if (form) {
                    form.requestSubmit();
                    setInput('');
                  }
                }
                setIsTranscribing(false);
                return;
              }

              if (transcript.includes('reset message') || transcript.includes('clear message')) {
                setInput('');
                setIsTranscribing(false);
                return;
              }

              // Only update input if we're in transcribing mode
              if (isTranscribing) {
                // Remove any wake words or commands from the transcript
                const cleanTranscript = transcript
                  .replace(/hey bueller|hello bueller|goodbye bueller|bye bueller|close bueller|start message|send message|send a message|reset message|clear message/gi, '')
                  .trim();

                if (cleanTranscript) {
                  setInput(cleanTranscript);
                }
              }
            }
          };

          recognitionRef.current.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            if (isRecording && recognitionRef.current) {
              try {
                recognitionRef.current.start();
              } catch (error) {
                console.error('Failed to restart speech recognition:', error);
              }
            }
          };

          recognitionRef.current.onend = () => {
            if (isRecording && recognitionRef.current) {
              try {
                recognitionRef.current.start();
              } catch (error) {
                console.error('Failed to restart speech recognition:', error);
              }
            }
          };

          recognitionRef.current.start();
          setIsRecording(true);
        } catch (error) {
          console.error('Failed to start speech recognition:', error);
        }
      }
    } else {
      // Stopping recording
      if (recognitionRef.current) {
        try {
          // Remove all event listeners
          recognitionRef.current.onresult = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.onend = null;
          
          // Stop the recognition
          recognitionRef.current.stop();
          
          // Clear the instance
          recognitionRef.current = null;
          
          // Update state
          setIsRecording(false);
          setIsTranscribing(false);
        } catch (error) {
          console.error('Failed to stop speech recognition:', error);
          // Force cleanup even if stop fails
          recognitionRef.current = null;
          setIsRecording(false);
          setIsTranscribing(false);
        }
      }
    }
  }, [isRecording, isOpen, onOpenChange, isTranscribing, input, setIsRecording, setIsTranscribing]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
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

  return (
    <>
      <Button 
        variant="nav" 
        onClick={(e: React.MouseEvent) => {
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
      <audio ref={audioRef} className="hidden" />
    </>
  );
} 