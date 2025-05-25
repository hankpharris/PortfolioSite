import { AnimatedBackground } from "@/components/AnimatedBackground";
import Link from "next/link";

export default function ProjectNotFound() {
    return (
        <div className="relative min-h-screen">
            <AnimatedBackground />
            <div className="relative z-10 container mx-auto px-16 py-8">
                <div className="bg-white/30 backdrop-blur-md rounded-xl shadow-lg overflow-hidden p-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Project Not Found</h1>
                    <p className="text-lg text-gray-700 mb-8">
                        The project you're looking for doesn't exist or has been removed.
                    </p>
                    <Link 
                        href="/projects" 
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Back to Projects
                    </Link>
                </div>
            </div>
        </div>
    );
} 