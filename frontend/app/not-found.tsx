import { Header } from "@/components/Header";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Button } from "@/components/buttons/Button";

export default function NotFound() {
    return (
        <main className="min-h-screen bg-gray-50">
            <Header />
            <AnimatedBackground />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
                    <p className="text-gray-600 mb-8">The page you're looking for doesn't exist. BAHHHHHHHHHH</p>
                    <Button href="/" variant="project">
                        Return Home
                    </Button>
                </div>
            </div>
        </main>
    );
} 