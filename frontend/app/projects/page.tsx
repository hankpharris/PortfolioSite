import { Suspense } from 'react';
import { getProjects } from '@/lib/db';
import type { Project } from '@/lib/validation';
import { ProjectCard } from '@/components/ProjectCard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProjectsPage() {
    try {
        const projects = await getProjects();

        return (
            <main className="min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project: Project & { validationWarning?: boolean }) => (
                            <ProjectCard
                                key={project.id}
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
                        ))}
                    </div>
                </div>
            </main>
        );
    } catch (error) {
        console.error('Error rendering ProjectsPage:', error);
        return (
            <main className="min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-red-500">
                        Error loading projects. Please try again later.
                    </div>
                </div>
            </main>
        );
    }
} 