import { ProjectOverview } from "@/components/ProjectOverview";
import { AnimatedBackground } from "@/components/AnimatedBackground";
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

async function getProject(id: string): Promise<Project> {
    const prisma = new PrismaClient({
        log: ['query', 'error', 'warn'],
    });

    try {
        const projectId = parseInt(id);
        if (isNaN(projectId)) {
            throw new Error('Invalid project ID');
        }

        console.log(`Fetching project with ID: ${projectId}`);
        const project = await prisma.project.findUnique({
            where: { id: projectId }
        });

        if (!project) {
            throw new Error('Project not found');
        }

        return project;
    } catch (error) {
        console.error('Error fetching project:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
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
                        Error loading project. Please try again later.
                    </div>
                </div>
            </main>
        );
    }
} 