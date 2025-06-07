'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import { useRouter } from 'next/navigation';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { MessageSquare, X, Send, Volume2, VolumeX } from 'lucide-react';
import { Button } from './buttons/Button';
import type { Message } from 'ai';

const welcomeMessage = {
  id: 'welcome',
  role: 'assistant' as const,
  content: `Hello! I'm "Bueller" the AI Chat Assistant. I can help you navigate the site and provide information about the projects. Feel free to ask me anything!`
};

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTTSEnabled, setIsTTSEnabled] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationTarget, setNavigationTarget] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();

  const { messages: aiMessages, input: aiInput, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    onResponse: async (response) => {
      const data = await response.json();
      if (data.useTTS && isTTSEnabled) {
        const audioUrl = `/api/chat?text=${encodeURIComponent(data.content)}`;
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play().catch(console.error);
        }
      }
    }
  });

  const handleNavigation = useCallback(() => {
    if (navigationTarget.startsWith('/')) {
      router.push(navigationTarget);
    } else if (/^\d+$/.test(navigationTarget)) {
      router.push(`/projects/${navigationTarget}`);
    } else {
      router.push(`/${navigationTarget}`);
    }
    setIsNavigating(false);
    setIsOpen(false);
  }, [navigationTarget, router]);

  const cancelNavigation = useCallback(() => {
    setIsNavigating(false);
    setNavigationTarget('');
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length, setMessages]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-3 bg-black/80 hover:bg-black text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
        aria-label="Open chat"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      <Transition show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-300"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-300"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-[calc(100vh-5rem)] flex-col overflow-y-auto bg-white/90 backdrop-blur-md shadow-xl rounded-lg border border-gray-200">
                      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <Dialog.Title className="text-lg font-semibold">Chat with Bueller</Dialog.Title>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setIsTTSEnabled(!isTTSEnabled)}
                            className={`p-2 rounded-full transition-colors ${
                              isTTSEnabled ? 'bg-black/10' : 'hover:bg-black/5'
                            }`}
                            aria-label={isTTSEnabled ? 'Disable TTS' : 'Enable TTS'}
                          >
                            {isTTSEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                          </button>
                          <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 rounded-full hover:bg-black/5 transition-colors"
                            aria-label="Close chat"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message, index) => (
                          <div
                            key={index}
                            className={`flex ${
                              message.role === 'user' ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <div
                              className={`max-w-[80%] rounded-lg p-3 ${
                                message.role === 'user'
                                  ? 'bg-black text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              {message.content}
                            </div>
                          </div>
                        ))}
                      </div>

                      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={input}
                            onChange={(e) => {
                              setInput(e.target.value);
                              handleInputChange(e);
                            }}
                            placeholder="Type your message..."
                            className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/20"
                          />
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="p-2 bg-black text-white rounded-lg hover:bg-black/90 transition-colors disabled:opacity-50"
                          >
                            <Send className="w-5 h-5" />
                          </button>
                        </div>
                      </form>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition show={isNavigating} as={Fragment}>
        <Dialog as="div" className="relative z-[60]" onClose={() => setIsNavigating(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-semibold mb-4">
                    Confirm Navigation
                  </Dialog.Title>
                  <p className="mb-6">Would you like to navigate to {navigationTarget}?</p>
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={cancelNavigation}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleNavigation}
                      className="px-4 py-2 bg-black text-white rounded-lg hover:bg-black/90 transition-colors"
                    >
                      Navigate
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <audio ref={audioRef} className="hidden" />
    </>
  );
} 