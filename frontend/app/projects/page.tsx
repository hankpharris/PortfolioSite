import { ProjectCard } from "@/components/ProjectCard";
import { PrismaClient } from '@prisma/client';

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
    const prisma = new PrismaClient({
        log: ['query', 'error', 'warn'],
    });

    try {
        console.log('Fetching all projects...');
        const projects = await prisma.project.findMany();
        console.log(`Found ${projects.length} projects`);
        return projects;
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
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