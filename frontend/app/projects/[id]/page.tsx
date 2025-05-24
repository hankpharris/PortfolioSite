import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getProject } from '@/lib/db';
import { ProjectCard } from '@/components/ProjectCard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProjectPage({ params }: { params: { id: string } }) {
    try {
        const project = await getProject(params.id);

        if (!project) {
            notFound();
        }

        return (
            <main className="min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    <ProjectCard
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
                </div>
            </main>
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