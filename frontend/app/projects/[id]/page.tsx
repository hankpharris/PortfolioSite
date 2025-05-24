import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { ProjectOverview } from '@/components/ProjectOverview';
import { getProject } from '@/lib/api';

// Make the page dynamic
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ProjectPageProps {
    params: {
        id: string;
    };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    try {
        const project = await getProject(params.id);
        
        if (!project) {
            notFound();
        }

        return (
            <main className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <Suspense fallback={<div>Loading project...</div>}>
                        <ProjectOverview project={project} />
                    </Suspense>
                </div>
            </main>
        );
    } catch (error) {
        console.error('Error rendering ProjectPage:', error);
        return (
            <main className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold text-gray-900">Error Loading Project</h1>
                        <p className="mt-2 text-gray-600">Please try again later.</p>
                    </div>
                </div>
            </main>
        );
    }
} 