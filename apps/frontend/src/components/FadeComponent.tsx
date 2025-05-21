import React, { useEffect, useRef } from "react";

interface FadeComponentProps {
    children: React.ReactNode;
    duration?: number;
}

function FadeComponent({ children, duration = 300 }: FadeComponentProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (element) {
            // Fade in
            element.style.opacity = "1";
            element.style.transition = `opacity ${duration}ms ease-in-out`;

            // Fade out after a delay
            setTimeout(() => {
                element.style.opacity = "0";
            }, 3000); // Adjust the delay to keep it visible for 3 seconds
        }
    }, [duration]);

    return (
        <div
            ref={ref}
            style={{
                position: "absolute",
                top: "110px",
                left: "50%",
                transform: "translateX(-50%)",
                padding: "12px 24px",
                backgroundColor: "#4CAF50",
                color: "#fff",
                borderRadius: "8px",
                fontWeight: "bold",
                opacity: "0", // Start with opacity 0 (invisible)
                zIndex: 9999,
            }}
        >
            {children}
        </div>
    );
}

export default FadeComponent;
