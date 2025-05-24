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
    const baseUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        
    const res = await fetch(`${baseUrl}/api/projects/${id}`, {
        cache: 'no-store'
    });
    
    if (!res.ok) {
        throw new Error('Failed to fetch project');
    }
    
    return res.json();
}

export default async function ProjectPage({ params }: { params: { id: string } }) {
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
} 