import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Header } from "@/components/Header";

export default function AboutMe() {
    return (
        <div className="min-h-screen w-full flex flex-col relative">
            <AnimatedBackground />
            <div className="flex-grow flex items-center justify-center py-8">
                <div className="container max-w-3xl mx-auto px-8 py-12 bg-white/90 rounded-2xl shadow-2xl backdrop-blur-md relative z-10">
                    <h1 className="text-4xl font-bold mb-8 text-center text-black drop-shadow-lg">About Me</h1>
                    <div className="flex justify-center mb-8">
                        <img src="/Logo.png" alt="Logo" className="w-64 h-64 rounded-full object-cover" />
                    </div>
                    <div className="text-lg text-gray-800 leading-relaxed space-y-4">
                        <p>
                            Hello! My name is Henry Pharris. I'm a senior at Worcester Polytechnic Institute studying RBE (Robotics Engineering) 
                            with minors in Computer Science and Music.
                        </p>
                        <p>
                            When outdoors I enjoy activities like snowboarding and sailing, but I also love making music and tinkering with both hardware and software when inside.
                        </p>
                        <p>
                            If you have any interest in hiring me in any capacity, or any questions about my work, don't hesitate to reach out to me via hopharris@wpi.edu.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
} 