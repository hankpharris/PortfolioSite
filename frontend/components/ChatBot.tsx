'use client';

import { useState, useCallback, useEffect } from 'react';
import { useChat } from 'ai/react';
import { useRouter } from 'next/navigation';
import { Dialog } from '@headlessui/react';
import { MessageSquare, X, Send } from 'lucide-react';
import { Button } from './buttons/Button';

const welcomeMessage = {
  role: 'assistant',
  content: `Hello! I'm "Bueller" the AI Chat Assistant. I can help you navigate the site and provide information about the projects. Feel free to ask me anything!`
};

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavigationConfirm, setShowNavigationConfirm] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState('');
  const router = useRouter();

  const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat({
    api: '/api/chat',
    onFinish: (message) => {
      const content = message.content;
      const navigationMatch = content.match(/^Navigating you to (?:project )?(\d+|\/\w+|\w+)/i);
      
      if (navigationMatch) {
        const path = navigationMatch[1];
        setPendingNavigation(path);
        setShowNavigationConfirm(true);
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <Button variant="nav">
          <MessageSquare className="w-5 h-5 mr-2" />
          Chat
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Content 
          className="fixed top-[88px] right-4 bottom-4 w-full max-w-md bg-white/30 backdrop-blur-md shadow-xl z-[101] rounded-xl transform transition-all duration-500 ease-in-out translate-x-full data-[state=open]:translate-x-0"
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200/50 bg-gray-800 rounded-t-xl">
              <Dialog.Title className="text-xl font-bold text-white">"Bueller" the AI Chat Assistant</Dialog.Title>
              <Dialog.Close className="text-gray-300 hover:text-white">
                <X size={20} />
              </Dialog.Close>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Static welcome message */}
              <div className="flex justify-start animate-fade-in">
                <div className="max-w-[80%] rounded-2xl p-3 bg-white/50 backdrop-blur-sm text-gray-800 whitespace-pre-line">
                  {welcomeMessage.content}
                </div>
              </div>

              {/* AI chat messages */}
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

            {/* Navigation Confirmation Dialog */}
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
} 