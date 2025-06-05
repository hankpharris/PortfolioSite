'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { MessageSquare, X, Send } from 'lucide-react';
import { Button } from './buttons/Button';
import { useChat } from 'ai/react';

const welcomeMessage = {
  content: `Hi! I'm Bueller, an AI assistant for this portfolio site. I was built by Henry Pharris using vercels AI SDK and OpenAI's GPT 3.5-Turbo model & api. I can help you:

• Navigate through different sections (About, Projects, Contact, etc)
• Find specific projects or information
• Answer questions about the portfolio
• Guide you to relevant pages

How can I help you today?`
};

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat'
  });

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
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
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>

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
    </Dialog.Root>
  );
} 