import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getProject } from '@/lib/db';
import { ProjectOverview } from '@/components/ProjectOverview';

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
                    <Suspense fallback={<div>Loading project...</div>}>
                        <ProjectOverview project={project} />
                    </Suspense>
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