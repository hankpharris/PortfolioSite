import Link from 'next/link';
import type { CSSProperties } from 'react';
import { Button } from './buttons/Button';
import { ProjectCardImage } from './ProjectCardImage';
import { StatusEnum } from '@/lib/validation';
import { StatusBadge } from './StatusBadge';
import { z } from 'zod';

interface ProjectCardProps {
    id: string;
    title: string;
    status: z.infer<typeof StatusEnum>;
    overview: string;
    description: string;
    overviewImage1: string;
    overviewImage2: string;
    overviewImage3: string;
    link?: string | null;
    gitHubLink?: string | null;
    index?: number;
    imagePriority?: boolean;
}

export function ProjectCard({
    id,
    title,
    status,
    overview,
    description,
    overviewImage1,
    overviewImage2,
    overviewImage3,
    link,
    gitHubLink,
    index = 0,
    imagePriority = false,
}: ProjectCardProps) {
    const headingId = `project-card-${id}-title`;
    const animationStyle = {
        animationDelay: `${Math.min(index, 8) * 120}ms`,
    } satisfies CSSProperties;

    return (
        <article
            className="project-card-reveal bg-white/80 backdrop-blur-md rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-[550px]"
            style={animationStyle}
            aria-labelledby={headingId}
        >
            <Link
                href={`/projects/${id}`}
                className="block flex-grow rounded-t-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                aria-describedby={`${headingId}-description`}
            >
                <ProjectCardImage src={overviewImage1} alt={`${title} project preview`} priority={imagePriority} />
                <div className="p-6 pb-2">
                    <h2 id={headingId} className="text-xl font-bold text-gray-800">{title}</h2>
                    <div className="mt-2">
                        <StatusBadge status={status} />
                    </div>
                </div>
                <div className="px-6 flex-grow">
                    <p id={`${headingId}-description`} className="text-base text-gray-900 whitespace-pre-wrap line-clamp-4 min-h-[80px]">{description}</p>
                    <span className="sr-only">View details for {title}</span>
                </div>
            </Link>
            <div className="px-6 pb-6 mt-auto">
                <div className="flex gap-4 justify-start">
                    {link && (
                        <Button href={link} variant="project" isExternal ariaLabel={`Open live project for ${title}`}>
                            View Project
                        </Button>
                    )}
                    {gitHubLink && (
                        <Button href={gitHubLink} variant="github" isExternal ariaLabel={`Open GitHub repository for ${title}`}>
                            GitHub
                        </Button>
                    )}
                </div>
            </div>
        </article>
    );
} 