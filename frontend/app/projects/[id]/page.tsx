import { ProjectOverview } from "@/components/ProjectOverview";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { getProject } from '@/lib/db';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProjectPage({ params }: { params: { id: string } }) {
    // Validate that the ID is a valid number
    const projectId = parseInt(params.id);
    if (isNaN(projectId)) {
        notFound();
    }

    const project = await getProject(params.id);
    if (!project) {
        notFound();
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