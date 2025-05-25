import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { ProjectOverview } from '@/components/ProjectOverview';
import { getProject } from '@/lib/db';
import { Status } from '@/lib/validation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
    params: {
        id: string;
    };
}

export default async function ProjectPage({ params }: PageProps) {
    try {
        const project = await getProject(params.id);

    if (!project) {
            console.log('Project not found:', params.id);
            notFound();
    }

        // Format the data to match ProjectOverview props
    const formattedData = {
        title: project.name,
            status: project.status as Status,
        overview: project.overviewText || '',
        description: project.description || '',
        overviewImage1: project.overviewImage1 || '',
        overviewImage2: project.overviewImage2 || '',
        overviewImage3: project.overviewImage3 || '',
            link: project.link,
            gitHubLink: project.gitHubLink
    };

    return (
            <div className="min-h-screen relative">
            <AnimatedBackground />
            <div className="relative z-10 container mx-auto px-16 py-8">
                    <Suspense fallback={<div>Loading...</div>}>
                <ProjectOverview {...formattedData} />
                    </Suspense>
            </div>
        </div>
    );
    } catch (error) {
        console.error('Error loading project:', error);
        notFound();
    }
} 