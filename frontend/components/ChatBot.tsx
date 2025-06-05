'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { MessageSquare, X, Send } from 'lucide-react';
import { Button } from './buttons/Button';
import { useChat } from 'ai/react';

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
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
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]" />
        <Dialog.Content className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-[101] transform transition-transform duration-300 ease-in-out">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <Dialog.Title className="text-xl font-bold">Chat Assistant</Dialog.Title>
              <Dialog.Close className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </Dialog.Close>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask me anything..."
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
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