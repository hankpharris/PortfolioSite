import Link from 'next/link';
import Image from 'next/image';
import { Button } from './buttons/Button';

export function Header() {
    return (
        <header className="bg-white/30 backdrop-blur-md shadow-lg">
            <nav className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <Link href="/" className="flex items-center space-x-2">
                        <Image
                            src="/LogoNoBG.png"
                            alt="Portfolio Logo"
                            width={40}
                            height={40}
                            priority
                            className="rounded-full"
                        />
                        <span className="text-2xl font-bold text-gray-800">Portfolio</span>
                    </Link>
                    <div className="space-x-4">
                        <Button href="/projects" variant="nav">
                            Projects
                        </Button>
                        <Button href="https://github.com/hankpharris" variant="nav" isExternal>
                            GitHub
                        </Button>
                    </div>
                </div>
            </nav>
        </header>
    );
} 