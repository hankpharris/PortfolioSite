import { ProjectOverview } from "@/components/ProjectOverview";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Project } from '@/lib/validation';

async function getProject(id: string): Promise<Project> {
    try {
        const baseUrl = process.env.VERCEL_URL 
            ? `https://${process.env.VERCEL_URL}`
            : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
            
        const url = `${baseUrl}/api/projects/${id}`;
        console.log('Fetching project from:', url);
        
        const res = await fetch(url, {
            cache: 'no-store',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        // Log response details for debugging
        console.log('Response status:', res.status);
        console.log('Response headers:', Object.fromEntries(res.headers.entries()));
        
        if (!res.ok) {
            let errorMessage = 'Failed to fetch project';
            try {
                const text = await res.text();
                console.log('Error response text:', text);
                if (text.startsWith('<!DOCTYPE')) {
                    errorMessage = `Server returned HTML instead of JSON (Status: ${res.status})`;
                } else {
                    const errorData = JSON.parse(text);
                    errorMessage = errorData.error || errorMessage;
                }
            } catch (e) {
                console.error('Failed to parse error response:', e);
                errorMessage = `Failed to parse error response (Status: ${res.status})`;
            }
            throw new Error(errorMessage);
        }
        
        const text = await res.text();
        console.log('Response text:', text);
        
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error('Failed to parse JSON response:', e);
            throw new Error('Invalid JSON response from server');
        }
        
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
        const project = await getProject(params.id);

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
                        {error instanceof Error ? error.message : 'Error loading project. Please try again later.'}
                    </div>
                </div>
            </main>
        );
    }
} 