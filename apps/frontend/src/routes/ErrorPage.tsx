import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { AnimatedBackground } from "@/components/AnimatedBackground";

export function ErrorPage() {
    const navigate = useNavigate();
    
    return (
        <div className="min-h-screen w-full flex flex-col relative">
            <AnimatedBackground />
            <Header />
            <div className="flex-grow flex items-center justify-center">
                <div className="container mx-auto px-4 py-8 bg-white/30 rounded-xl shadow-lg backdrop-blur-md relative z-10 text-center">
                    <div className="text-8xl mb-6">🔍</div>
                    <h1 className="text-6xl font-bold mb-4 text-black drop-shadow-lg">404</h1>
                    <h2 className="text-3xl mb-6 text-black">Page Not Found</h2>
                    <p className="text-xl mb-8 text-black max-w-2xl mx-auto">
                        The page you're looking for might have been moved, deleted, or never existed.
                    </p>
                    <button 
                        onClick={() => navigate('/projects')}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Return to Projects
                    </button>
                </div>
            </div>
        </div>
    );
}
