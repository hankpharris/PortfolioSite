'use client';

import { useState, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { MessageSquare, X, Send } from 'lucide-react';
import { Button } from './buttons/Button';
import { useChat } from 'ai/react';
import { useRouter } from 'next/navigation';
import { Dialog as HeadlessUIDialog, Transition } from '@headlessui/react';
import { XMarkIcon, PaperAirplaneIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline';

const welcomeMessage = {
  content: `Hi! I'm Bueller, an AI assistant for this portfolio site. I was built by Henry Pharris using vercels AI SDK and OpenAI's GPT 3.5-Turbo model & api. I can help you:

• Navigate through different sections (About, Projects, Contact, etc)
• Find specific projects or information
• Answer questions about the portfolio
• Guide you to relevant pages

How can I help you today?`
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTTSEnabled, setIsTTSEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    onFinish: async (message) => {
      const content = message.content;
      const navigationMatch = content.match(/^Navigating you to (?:project )?(\d+|\/\w+|\w+)/i);
      
      if (navigationMatch) {
        const path = navigationMatch[1];
        if (path.startsWith('/')) {
          router.push(path);
        } else if (path.match(/^\d+$/)) {
          router.push(`/projects/${path}`);
        } else {
          router.push(`/${path}`);
        }
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

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-900 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
          />
        </svg>
      </button>

      <Transition.Root show={isOpen} as={HeadlessUIDialog.Root} onClose={setIsOpen}>
        <Transition.Child
          as={HeadlessUIDialog.Overlay}
          enter="ease-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={HeadlessUIDialog.Panel}
                className="pointer-events-auto w-screen max-w-md"
              >
                <div className="flex h-[calc(100vh-72px)] flex-col overflow-y-scroll bg-gray-100/80 backdrop-blur-sm shadow-xl">
                  <div className="px-4 py-6 sm:px-6 bg-gray-800/80 backdrop-blur-sm">
                    <div className="flex items-start justify-between">
                      <HeadlessUIDialog.Title className="text-base font-semibold leading-6 text-white">
                        "Bueller" the AI Chat Assistant
                      </HeadlessUIDialog.Title>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          className="relative rounded-md bg-gray-800 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          onClick={() => setIsOpen(false)}
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="relative flex-1 px-4 sm:px-6">
                    <div className="absolute inset-0 px-4 sm:px-6">
                      <div className="h-full border-gray-200 py-6">
                        <div className="space-y-4">
                          {/* Welcome message */}
                          <div className="flex justify-start">
                            <div className="max-w-[80%] rounded-2xl bg-white/50 backdrop-blur-sm p-3 text-gray-800 whitespace-pre-line">
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
                          <div ref={messagesEndRef} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 border-t border-gray-200 px-4 py-4 sm:px-6">
                    <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
                      <input
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Type your message..."
                        className="flex-1 rounded-lg border border-gray-300 bg-white/50 backdrop-blur-sm px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => setIsTTSEnabled(!isTTSEnabled)}
                        className={`rounded-lg p-2 ${
                          isTTSEnabled
                            ? 'bg-gray-800 text-white hover:bg-gray-900'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        } transition-colors`}
                        title={isTTSEnabled ? 'Disable TTS' : 'Enable TTS'}
                      >
                        {isTTSEnabled ? (
                          <SpeakerWaveIcon className="h-5 w-5" />
                        ) : (
                          <SpeakerXMarkIcon className="h-5 w-5" />
                        )}
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="rounded-lg bg-gray-800 px-4 py-2 text-white hover:bg-gray-900 disabled:opacity-50"
                      >
                        <PaperAirplaneIcon className="h-5 w-5" />
                      </button>
                    </form>
                  </div>
                </div>
              </HeadlessUIDialog.Panel>
            </div>
          </div>
        </div>
      </Transition.Root>
      <audio ref={audioRef} className="hidden" />
    </>
  );
} 