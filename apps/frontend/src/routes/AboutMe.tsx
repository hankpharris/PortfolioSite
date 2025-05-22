import React from "react";
import { Header } from "@/components/Header";
import { AnimatedBackground } from "@/components/AnimatedBackground";

export function AboutMe() {
    return (
        <div className="min-h-screen w-full flex flex-col relative">
            <AnimatedBackground />
            <Header />
            <div className="flex-grow flex items-center justify-center py-8">
                <div className="container max-w-3xl mx-auto px-8 py-12 bg-white/90 rounded-2xl shadow-2xl backdrop-blur-md relative z-10">
                    <h1 className="text-4xl font-bold mb-8 text-center text-black drop-shadow-lg">About Me</h1>
                    <div className="flex justify-center mb-8">
                        <img src="/images/Logo.png" alt="Logo" className="w-64 h-64 rounded-full object-cover" />
                    </div>
                    <div className="text-lg text-gray-800 leading-relaxed space-y-4">
                        <p>
                            Hello! My name is Henry Pharris. I'm a senior at Worcester Polytechnic Institute studying RBE (Robotics Engineering) 
                            with a minors in Computer Science and Music.
                        </p>
                        <p>
                            I enjoy outdoor activities like snowboarding and sailing as well as music and tinkering with both hardware and software.
                        </p>
                        <p>
                            If you have any ineterst in hiring me in any capacity, or any questions about my work, don't hesitate to reach out to me via hopharris@wpi.edu.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
} 