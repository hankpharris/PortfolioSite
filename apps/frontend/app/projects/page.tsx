import { ProjectCard } from "@/components/ProjectCard";

async function getProjects() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${baseUrl}/api/projects`, { cache: 'no-store' });
    if (!res.ok) {
        throw new Error('Failed to fetch projects');
    }
    const data = await res.json();
    //console.log('Project data:', data); // Debug log
    return data;
}

export default async function ProjectsPage() {
    const projects = await getProjects();

    return (
        <main className="min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project: any) => (
                        <ProjectCard
                            key={project.id}
                            id={project.id}
                            title={project.name}
                            overview={project.overviewText}
                            description={project.description}
                            overviewImage1={project.overviewImage1}
                            overviewImage2={project.overviewImage2}
                            overviewImage3={project.overviewImage3}
                            link={project.link}
                            gitHubLink={project.gitHubLink}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
} 