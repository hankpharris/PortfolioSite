import { ProjectOverview } from "@/components/ProjectOverview";
import { AnimatedBackground } from "@/components/AnimatedBackground";

async function getProject(id: string) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    try {
        const res = await fetch(`${baseUrl}/api/projects/${id}`, { 
            cache: 'no-store',
            headers: {
                'Accept': 'application/json',
            }
        });
        
        if (!res.ok) {
            throw new Error(`Failed to fetch project: ${res.status}`);
        }
        
        const data = await res.json();
        
        // Map API fields to component props
        const formattedData = {
            title: data.name,
            overview: data.overviewText,
            description: data.description,
            overviewImage1: data.overviewImage1,
            overviewImage2: data.overviewImage2,
            overviewImage3: data.overviewImage3,
            link: data.link,
            gitHubLink: data.gitHubLink
        };
        
        return formattedData;
    } catch (error) {
        console.error('Error fetching project:', error);
        throw error;
    }
}

export default async function ProjectPage({ params }: { params: { id: string } }) {
    const project = await getProject(params.id);

    return (
        <main className="min-h-screen">
            <AnimatedBackground />
            <div className="container mx-auto px-4 py-8">
                <ProjectOverview
                    title={project.title}
                    overview={project.overview}
                    description={project.description}
                    overviewImage1={project.overviewImage1}
                    overviewImage2={project.overviewImage2}
                    overviewImage3={project.overviewImage3}
                    link={project.link}
                    gitHubLink={project.gitHubLink}
                />
            </div>
        </main>
    );
} 