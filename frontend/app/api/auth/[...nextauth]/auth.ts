import { DefaultSession, NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

// Extend the built-in session types
declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
            role: string;
        } & DefaultSession["user"]
    }
}

// Helper function to get the appropriate GitHub credentials based on the request origin
const getGitHubCredentials = (url: string) => {
    const isPersonalDomain = url.includes('your-personal-domain.com'); // Replace with your actual domain
    return {
        clientId: isPersonalDomain ? process.env.GITHUB_ID_PERSONAL! : process.env.GITHUB_ID!,
        clientSecret: isPersonalDomain ? process.env.GITHUB_SECRET_PERSONAL! : process.env.GITHUB_SECRET!
    };
};

export const authOptions: NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            if (account?.provider === "github") {
                const response = await fetch("https://api.github.com/user", {
                    headers: {
                        Authorization: `token ${account.access_token}`,
                    },
                });
                const githubUser = await response.json();
                // Get the list of allowed users from env and split by comma
                const allowedUsers = process.env.ALLOWED_GITHUB_USERS?.split(',') || [];
                // Trim whitespace from each username and check if current user is allowed
                return allowedUsers.map(user => user.trim()).includes(githubUser.login);
            }
            return false;
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.role = "admin";
            }
            return token;
        },
        async session({ session, token }: { session: any; token: any }) {
            if (session?.user) {
                session.user.role = token.role as string;
            }
            return session;
        }
    },
    pages: {
        signIn: "/auth/signin",
    },
    // Add support for multiple domains
    cookies: {
        sessionToken: {
            name: `__Secure-next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: true,
                // Remove domain setting to allow cookies to work across both domains
                // The domain will be automatically set based on the request origin
            }
        }
    }
}; 