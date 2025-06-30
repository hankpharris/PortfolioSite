import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { AnimatedBackground } from "@/components/AnimatedBackground";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Henry Pharris - Portfolio",
    description: "Henry Pharris is a senior at Worcester Polytechnic Institute studying Robotics Engineering with minors in Computer Science and Music. View my projects and get in touch.",
    keywords: ["Henry Pharris", "portfolio", "robotics engineering", "computer science", "music", "projects", "developer", "WPI", "Worcester Polytechnic Institute", "software engineer", "robotics engineer"],
    authors: [{ name: "Henry Pharris" }],
    creator: "Henry Pharris",
    publisher: "Henry Pharris",
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://henry-pharris.it.com'}/projects/1`,
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: process.env.NEXT_PUBLIC_BASE_URL || 'https://henry-pharris.it.com',
        title: "Henry Pharris - Portfolio",
        description: "Henry Pharris is a senior at Worcester Polytechnic Institute studying Robotics Engineering with minors in Computer Science and Music. View my projects and get in touch.",
        siteName: "Henry Pharris Portfolio",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AnimatedBackground />
                <Header />
                <main className="pt-[88px]">
                    {children}
                </main>
            </body>
        </html>
    );
} 