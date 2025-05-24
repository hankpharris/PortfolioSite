import { Suspense } from 'react';
import { ProjectOverview } from '@/components/ProjectOverview';
import { getProjects } from '@/lib/api';

// Make the page dynamic
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProjectsPage() {
    try {
        const projects = await getProjects();

        return (
            <main className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Projects</h1>
                    <div className="grid grid-cols-1 gap-8">
                        <Suspense fallback={<div>Loading projects...</div>}>
                            {projects.map((project) => (
                                <ProjectOverview key={project.id} project={project} />
                            ))}
                        </Suspense>
                    </div>
                </div>
            </main>
        );
    } catch (error) {
        console.error('Error rendering ProjectsPage:', error);
        return (
            <main className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold text-gray-900">Error Loading Projects</h1>
                        <p className="mt-2 text-gray-600">Please try again later.</p>
                    </div>
                </div>
            </main>
        );
    }
} 