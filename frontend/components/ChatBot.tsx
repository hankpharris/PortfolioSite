'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { MessageSquare, X, Send, Volume2, VolumeX, Mic, MicOff } from 'lucide-react';
import { Button } from './buttons/Button';
import { useChat } from 'ai/react';
import { useRouter } from 'next/navigation';
import { useChatStore } from '../store/chatStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

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

export function ChatBot() {
  const { isOpen, setIsOpen, isRecording, setIsRecording } = useChatStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isHandlingErrorRef = useRef(false);

  const { messages, handleSubmit: handleChatSubmit } = useChat({
    api: '/api/chat',
    onFinish: () => {
      setIsLoading(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    await handleChatSubmit(e);
    setInput('');
  };

  const toggleRecording = useCallback(() => {
    if (!recognitionRef.current) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.error('Speech recognition not supported');
        return;
      }

      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join('');

        setInput(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        if (isRecording) {
          recognitionRef.current?.start();
        }
      };
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  }, [isRecording]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="nav"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chat with Bueller</DialogTitle>
          <DialogDescription>
            Ask me anything about my experience and skills.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200/50 bg-gray-800 rounded-t-xl">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-200">Chat with Bueller</span>
            </div>
            <Button
              variant="nav"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 rounded-full p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, i) => (
              <div
                key={i}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200/50">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button
                variant="nav"
                onClick={() => handleSubmit(new Event('submit') as unknown as React.FormEvent<HTMLFormElement>)}
                className="h-10 w-10 rounded-full p-0"
                disabled={isLoading}
              >
                <Send className="h-5 w-5" />
              </Button>
              <Button
                variant="nav"
                onClick={toggleRecording}
                className="h-10 w-10 rounded-full p-0"
                disabled={isLoading}
              >
                {isRecording ? (
                  <MicOff className="h-5 w-5" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </Button>
            </form>
          </div>
        </div>
        <audio ref={audioRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
} 