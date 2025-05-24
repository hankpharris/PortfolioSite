import { ProjectCard } from "@/components/ProjectCard";

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

async function getProjects(): Promise<Project[]> {
    try {
        const baseUrl = process.env.VERCEL_URL 
            ? `https://${process.env.VERCEL_URL}`
            : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
            
        console.log('Fetching from:', baseUrl);
        
        const res = await fetch(`${baseUrl}/api/projects`, {
            cache: 'no-store'
        });
        
        if (!res.ok) {
            const errorData = await res.json();
            console.error('API Error:', errorData);
            throw new Error(errorData.error || 'Failed to fetch projects');
        }
        
        return res.json();
    } catch (error) {
        console.error('Error in getProjects:', error);
        throw error;
    }
}

export default async function ProjectsPage() {
    try {
        const projects = await getProjects();

        return (
            <main className="min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project: Project) => (
                            <ProjectCard
                                key={project.id}
                                id={project.id.toString()}
                                title={project.name}
                                overview={project.overviewText || ''}
                                description={project.description || ''}
                                overviewImage1={project.overviewImage1 || ''}
                                overviewImage2={project.overviewImage2 || ''}
                                overviewImage3={project.overviewImage3 || ''}
                                link={project.link || ''}
                                gitHubLink={project.gitHubLink || ''}
                            />
                        ))}
                    </div>
                </div>
            </main>
        );
    } catch (error) {
        console.error('Error rendering ProjectsPage:', error);
        return (
            <main className="min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-red-500">
                        Error loading projects. Please try again later.
                    </div>
                </div>
            </main>
        );
    }
} 