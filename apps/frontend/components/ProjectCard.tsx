import Link from 'next/link';
import { Button } from './buttons/Button';
import { ProjectCardImage } from './ProjectCardImage';

interface ProjectCardProps {
    id: string;
    title: string;
    overview: string;
    description: string;
    overviewImage1: string;
    overviewImage2: string;
    overviewImage3: string;
    link?: string | null;
    gitHubLink?: string | null;
}

export function ProjectCard({
    id,
    title,
    overview,
    description,
    overviewImage1,
    overviewImage2,
    overviewImage3,
    link,
    gitHubLink,
}: ProjectCardProps) {
    return (
        <div className="bg-white/30 backdrop-blur-md rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-[500px]">
            <Link href={`/projects/${id}`} className="block flex-grow">
                <ProjectCardImage src={overviewImage1} alt={`${title} overview`} />
                <h3 className="text-xl font-bold text-gray-800 p-6 pb-2">{title}</h3>
                <div className="px-6 flex-grow">
                    <p className="text-base text-gray-900 whitespace-pre-wrap line-clamp-4 min-h-[80px]">{description}</p>
                </div>
            </Link>
            <div className="px-6 pb-6 mt-auto">
                <div className="flex gap-4 justify-start">
                    {link && (
                        <Button href={link} variant="project" isExternal>
                            View Project
                        </Button>
                    )}
                    {gitHubLink && (
                        <Button href={gitHubLink} variant="github" isExternal>
                            GitHub
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
} 