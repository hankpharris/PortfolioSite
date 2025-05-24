import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { ProjectOverview } from '@/components/ProjectOverview';
import { getProject } from '@/lib/db';

// Make the page dynamic
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProjectPage({ params }: { params: { id: string } }) {
    const project = await getProject(params.id);

    if (!project) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Suspense fallback={<div>Loading...</div>}>
                    <ProjectOverview project={project} />
                </Suspense>
            </div>
        </main>
    );
} 