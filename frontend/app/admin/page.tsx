import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/auth";
import { SignOutButton } from "@/components/buttons/SignOutButton";

export default async function AdminPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/api/auth/signin");
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Admin Panel</h1>
                <SignOutButton />
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Welcome to the admin panel. You are currently authenticated as: <span className="font-semibold">{session.user?.name}</span>
                </p>
                <p className="text-green-600 dark:text-green-400">
                    ✓ Authentication successful - You have full access to this area
                </p>
            </div>
        </div>
    );
} 