import Link from 'next/link';
import { Button } from './buttons/Button';
import { ProjectCardImage } from './ProjectCardImage';
import { StatusEnum } from '@/lib/validation';
import { StatusBadge } from './StatusBadge';
import { z } from 'zod';
import Image from 'next/image';

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
}: ProjectCardProps) {
    return (
        <Link href={`/projects/${id}`} className="group">
            <div className="bg-white/30 backdrop-blur-md rounded-xl shadow-lg overflow-hidden transition-transform duration-300 group-hover:scale-105">
                {overviewImage1 && (
                    <div className="relative h-48 w-full">
                        <Image
                            src={`/${overviewImage1}`}
                            alt={title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                )}
                <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                        <StatusBadge status={status} />
                    </div>
                    <p className="text-gray-600 line-clamp-2">{overview}</p>
                </div>
            </div>
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
        </Link>
    );
} 