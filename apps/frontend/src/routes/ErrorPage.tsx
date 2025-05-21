import { useNavigate } from "react-router-dom";
import { Footer } from "@/components/Footer";

export function ErrorPage() {
    const navigate = useNavigate();
    
    return (
        <div className="animated-gradient-bg min-h-screen w-full flex flex-col items-center justify-between relative">
            <div className="animated-shapes">
                <div className="triangle"></div>
                <div className="square"></div>
            </div>
            
            <div className="container mx-auto px-4 py-8 bg-white/30 rounded-xl shadow-lg backdrop-blur-md relative z-10 text-center mt-20">
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

            <Footer />
        </div>
    );
}
