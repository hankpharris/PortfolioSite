'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from './buttons/Button';
import { ContactForm } from './ContactForm';
import { ChatBot } from './ChatBot';
import { useChatStore } from '../store/chatStore';

export function Header() {
    const { isOpen, setIsOpen } = useChatStore();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/30 backdrop-blur-md shadow-lg">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-gray-900 focus:shadow-lg"
            >
                Skip to main content
            </a>
            <nav className="container mx-auto px-4 py-4" aria-label="Primary navigation">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
                    <Link
                        href="/"
                        className="flex items-center space-x-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        aria-label="Henry Pharris portfolio home"
                    >
                        <Image
                            src="/LogoNoBG.png"
                            alt=""
                            width={40}
                            height={40}
                            priority
                            className="rounded-full"
                        />
                        <span className="text-2xl font-bold text-gray-800">Portfolio</span>
                    </Link>
                    <div className="flex flex-wrap gap-2 md:space-x-4">
                        <Button href="/about" variant="nav">
                            About Me
                        </Button>
                        <Button href="/projects" variant="nav">
                            Projects
                        </Button>
                        <Button href="https://github.com/hankpharris" variant="nav" isExternal>
                            GitHub
                        </Button>
                        <ContactForm />
                        <ChatBot />
                    </div>
                </div>
            </nav>
        </header>
    );
} 