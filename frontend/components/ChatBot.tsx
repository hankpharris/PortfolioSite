'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import { useRouter } from 'next/navigation';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { MessageSquare, X, Send, Volume2, VolumeX } from 'lucide-react';
import { Button } from './buttons/Button';

const welcomeMessage = {
  id: 'welcome',
  role: 'assistant' as const,
  content: `Hello! I'm "Bueller" the AI Chat Assistant. I can help you navigate the site and provide information about the projects. Feel free to ask me anything!`
};

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavigationConfirm, setShowNavigationConfirm] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState('');
  const [isTTSEnabled, setIsTTSEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();

  const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat({
    api: '/api/chat',
    onFinish: async (message) => {
      const content = message.content;
      const navigationMatch = content.match(/^Navigating you to (?:project )?(\d+|\/\w+|\w+)/i);
      
      if (navigationMatch) {
        const path = navigationMatch[1];
        setPendingNavigation(path);
        setShowNavigationConfirm(true);
      }

      // Handle TTS if enabled
      if (isTTSEnabled && message.role === 'assistant') {
        try {
          const response = await fetch(`/api/chat?text=${encodeURIComponent(content)}`);
          if (!response.ok) throw new Error('TTS request failed');
          
          const audioBlob = await response.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          
          if (audioRef.current) {
            audioRef.current.src = audioUrl;
            audioRef.current.play();
          }
        } catch (error) {
          console.error('Error playing TTS:', error);
        }
      }
    }
  });

  const handleNavigation = useCallback(() => {
    if (pendingNavigation.startsWith('/')) {
      router.push(pendingNavigation);
    } else if (/^\d+$/.test(pendingNavigation)) {
      router.push(`/projects/${pendingNavigation}`);
    } else {
      router.push(`/${pendingNavigation}`);
    }
    setShowNavigationConfirm(false);
    setIsOpen(false);
  }, [pendingNavigation, router]);

  const cancelNavigation = useCallback(() => {
    setShowNavigationConfirm(false);
    setPendingNavigation('');
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length, setMessages]);

  return (
    <>
      <Button variant="nav" onClick={() => setIsOpen(true)}>
        <MessageSquare className="w-5 h-5 mr-2" />
        Chat
      </Button>

      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-in-out duration-500"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in-out duration-500"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <div className="absolute inset-y-0 right-0 w-screen max-w-md pointer-events-none">
              <div className="flex h-[calc(100vh-144px)] flex-col bg-white/30 backdrop-blur-md shadow-xl rounded-xl mt-[88px] mr-4 mb-4 pointer-events-auto">
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
                      className="text-gray-300 hover:text-white"
                      onClick={() => setIsOpen(false)}
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === 'assistant' ? 'justify-start' : 'justify-end'
                      } animate-fade-in`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl p-3 ${
                          message.role === 'assistant'
                            ? 'bg-white/50 backdrop-blur-sm text-gray-800'
                            : 'bg-gray-800/80 backdrop-blur-sm text-white'
                        } whitespace-pre-line`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>

                {showNavigationConfirm && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-xl">
                    <div className="bg-white/90 p-6 rounded-xl shadow-xl max-w-sm mx-4">
                      <h3 className="text-lg font-semibold mb-2">Confirm Navigation</h3>
                      <p className="mb-4">Would you like to navigate to {pendingNavigation}?</p>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={cancelNavigation}
                          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleNavigation}
                          className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-900 transition-colors"
                        >
                          Navigate
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200/50">
                  <div className="flex gap-2">
                    <input
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Ask me anything..."
                      className="flex-1 rounded-lg border border-gray-300/50 bg-white/50 backdrop-blur-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="bg-gray-800 text-white p-2 rounded-lg hover:bg-gray-900 transition-colors"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition.Root>
      <audio ref={audioRef} className="hidden" />
    </>
  );
} 