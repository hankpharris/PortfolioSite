import { PrismaClient } from 'database';
import { config } from 'dotenv';
import { resolve } from 'path';
import { ProjectOverview } from "@/components/ProjectOverview";
import { AnimatedBackground } from "@/components/AnimatedBackground";

// Load environment variables from root .env
config({ path: resolve(process.cwd(), '../../.env') });

const prisma = new PrismaClient({
    log: ['query', 'error', 'warn'],
});

export default async function ProjectPage({ params }: { params: { id: string } }) {
    const id = parseInt(params.id);
    if (isNaN(id)) {
        throw new Error('Invalid project ID');
    }

    const project = await prisma.project.findUnique({
        where: { id }
    });

    if (!project) {
        throw new Error('Project not found');
    }

    // Map Prisma fields to component props
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