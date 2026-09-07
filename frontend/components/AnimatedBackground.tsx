'use client';

import { useEffect, useRef } from 'react';

export function AnimatedBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Particle settings
        const particles: Array<{
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;
        }> = [];

        // Create particles
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                speedX: Math.random() * 2 - 1,
                speedY: Math.random() * 2 - 1,
            });
        }

        // Animation loop
        let animationFrameId: number | null = null;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw particles
            particles.forEach((particle) => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;

                // Bounce off edges
                if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.fill();
            });

            animationFrameId = window.requestAnimationFrame(animate);
        };

        const stopAnimation = () => {
            if (animationFrameId !== null) {
                window.cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        };

        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const syncMotionPreference = () => {
            if (motionQuery.matches) {
                stopAnimation();
                return;
            }

            if (animationFrameId === null) {
                animate();
            }
        };

        motionQuery.addEventListener('change', syncMotionPreference);
        syncMotionPreference();

        // Cleanup
        return () => {
            stopAnimation();
            motionQuery.removeEventListener('change', syncMotionPreference);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="fixed top-0 left-0 w-full h-full -z-10"
            style={{ background: 'linear-gradient(45deg, #1a1a1a, #2a2a2a)' }}
        />
    );
} 