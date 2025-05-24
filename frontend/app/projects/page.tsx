import { Suspense } from 'react';
import { ProjectOverview } from '@/components/ProjectOverview';
import { getProjects } from '@/lib/db';
import type { Project } from '@/lib/validation';

// Make the page dynamic
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProjectsPage() {
    const projects = await getProjects();

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Projects</h1>
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    <Suspense fallback={<div>Loading projects...</div>}>
                        {projects.map((project: Project & { validationWarning?: boolean }) => (
                            <ProjectOverview key={project.id} project={project} />
                        ))}
                    </Suspense>
                </div>
            </div>
        </main>
    );
} 