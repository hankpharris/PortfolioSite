import Image from 'next/image';
import { Button } from './buttons/Button';
import { Project } from '@/lib/validation';

export interface ProjectOverviewProps {
    project: Project;
}

export function ProjectOverview({ project }: ProjectOverviewProps) {
    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{project.name}</h1>
                
                {project.overviewText && (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Overview</h2>
                        <p className="text-gray-600">{project.overviewText}</p>
                    </div>
                )}

                {project.description && (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Description</h2>
                        <p className="text-gray-600 whitespace-pre-wrap">{project.description}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {project.overviewImage1 && (
                        <img 
                            src={project.overviewImage1} 
                            alt="Project overview 1" 
                            className="w-full h-48 object-cover rounded-lg"
                        />
                    )}
                    {project.overviewImage2 && (
                        <img 
                            src={project.overviewImage2} 
                            alt="Project overview 2" 
                            className="w-full h-48 object-cover rounded-lg"
                        />
                    )}
                    {project.overviewImage3 && (
                        <img 
                            src={project.overviewImage3} 
                            alt="Project overview 3" 
                            className="w-full h-48 object-cover rounded-lg"
                        />
                    )}
                </div>

                <div className="flex flex-wrap gap-4">
                    {project.link && (
                        <a 
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            View Project
                        </a>
                    )}
                    {project.gitHubLink && (
                        <a 
                            href={project.gitHubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            View on GitHub
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
} 