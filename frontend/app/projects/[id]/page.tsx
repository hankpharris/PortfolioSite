import { ProjectOverview } from "@/components/ProjectOverview";
import { AnimatedBackground } from "@/components/AnimatedBackground";

type Project = {
    id: number;
    name: string;
    overviewText: string | null;
    description: string | null;
    overviewImage1: string | null;
    overviewImage2: string | null;
    overviewImage3: string | null;
    link: string | null;
    gitHubLink: string | null;
};

async function getProject(id: string): Promise<Project> {
    try {
        // Ensure we have a valid base URL
        let baseUrl = 'http://localhost:3000';
        if (process.env.VERCEL_URL) {
            baseUrl = `https://${process.env.VERCEL_URL}`;
        } else if (process.env.NEXT_PUBLIC_API_URL) {
            baseUrl = process.env.NEXT_PUBLIC_API_URL;
        }
        
        // Ensure the URL is properly formatted
        const apiUrl = new URL(`/api/projects/${id}`, baseUrl).toString();
        console.log('Fetching project from:', apiUrl);
        
        const res = await fetch(apiUrl, {
            cache: 'no-store',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ error: 'Failed to parse error response' }));
            console.error('API Error:', errorData);
            throw new Error(errorData.error || 'Failed to fetch project');
        }
        
        const data = await res.json();
        if (!data || typeof data !== 'object') {
            console.error('Unexpected response format:', data);
            throw new Error('Invalid response format');
        }
        
        return data;
    } catch (error) {
        console.error('Error in getProject:', error);
        throw error;
    }
}

export default async function ProjectPage({ params }: { params: { id: string } }) {
    try {
        const id = parseInt(params.id);
        if (isNaN(id)) {
            throw new Error('Invalid project ID');
        }

        const project = await getProject(params.id);

        if (!project) {
            throw new Error('Project not found');
        }

        // Map API response to component props
        const formattedData = {
            title: project.name,
            overview: project.overviewText || '',
            description: project.description || '',
            overviewImage1: project.overviewImage1 || '',
            overviewImage2: project.overviewImage2 || '',
            overviewImage3: project.overviewImage3 || '',
            link: project.link || '',
            gitHubLink: project.gitHubLink || ''
        };

        return (
            <div className="relative min-h-screen">
                <AnimatedBackground />
                <div className="relative z-10 container mx-auto px-16 py-8">
                    <ProjectOverview {...formattedData} />
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error rendering ProjectPage:', error);
        return (
            <main className="min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-red-500">
                        Error loading project. Please try again later.
                    </div>
                </div>
            </main>
        );
    }
} 