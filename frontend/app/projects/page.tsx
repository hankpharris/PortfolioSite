import { getProjects } from '@/lib/db';
import type { Project } from '@/lib/validation';
import { ProjectCard } from '@/components/ProjectCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Projects",
    description: "Explore my portfolio of projects in robotics engineering, computer science, and software development.",
    alternates: {
        canonical: '/projects',
    },
    openGraph: {
        title: "Projects",
        description: "Explore my portfolio of projects in robotics engineering, computer science, and software development.",
    },
};

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
    try {
        const projects = await getProjects();
        console.log('Fetched projects:', projects);

        if (!projects || projects.length === 0) {
            return (
                <section className="min-h-screen" aria-labelledby="projects-heading">
                    <div className="container mx-auto px-4 py-8">
                        <div className="text-center">
                            <h1 id="projects-heading" className="text-2xl font-semibold text-gray-900">No Projects Found</h1>
                            <p className="mt-2 text-gray-600">There are no projects to display at the moment.</p>
                        </div>
                    </div>
                </section>
            );
        }

        return (
            <section className="min-h-screen" aria-labelledby="projects-heading">
                <div className="container mx-auto px-4 py-8">
                    <h1 id="projects-heading" className="text-3xl font-bold mb-4 text-gray-900">Projects</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project, index) => (
                            <ProjectCard
                                key={project.id}
                                id={project.id.toString()}
                                title={project.name}
                                status={project.status}
                                overview={project.overviewText || ''}
                                description={project.description || ''}
                                overviewImage1={project.overviewImage1 || ''}
                                overviewImage2={project.overviewImage2 || ''}
                                overviewImage3={project.overviewImage3 || ''}
                                link={project.link || ''}
                                gitHubLink={project.gitHubLink || ''}
                                index={index}
                                imagePriority={index === 0}
                            />
                        ))}
                    </div>
                </div>
            </section>
        );
    } catch (error) {
        console.error('Error rendering ProjectsPage:', error);
        return (
            <section className="min-h-screen" aria-labelledby="projects-error-heading">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-red-700" role="alert">
                        <h1 id="projects-error-heading" className="text-2xl font-semibold">Error loading projects</h1>
                        <p>Please try again later.</p>
                    </div>
                </div>
            </section>
        );
    }
} 