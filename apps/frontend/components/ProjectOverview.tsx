import Image from 'next/image';
import { Button } from './buttons/Button';

interface ProjectOverviewProps {
    title: string;
    overview: string;
    description: string;
    overviewImage1: string;
    overviewImage2: string;
    overviewImage3: string;
    link?: string | null;
    gitHubLink?: string | null;
}

export function ProjectOverview({
    title,
    overview,
    description,
    overviewImage1,
    overviewImage2,
    overviewImage3,
    link,
    gitHubLink,
}: ProjectOverviewProps) {
    return (
        <div className="bg-white/30 backdrop-blur-md rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
                {/* Header section with title and buttons */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">{title}</h1>
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

                {/* First image */}
                {overviewImage1 && (
                    <div className="relative h-96 mb-8 rounded-xl overflow-hidden">
                        <Image
                            src={`/${overviewImage1}`}
                            alt={`${title} overview`}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority
                        />
                    </div>
                )}

                {/* Overview text */}
                {overview && (
                    <div className="prose max-w-none mb-8">
                        <p className="text-lg text-gray-900 whitespace-pre-wrap">{overview}</p>
                    </div>
                )}

                {/* Remaining images in grid */}
                <div className="grid grid-cols-1 gap-6">
                    {overviewImage2 && (
                        <div className="relative w-full aspect-[16/9] overflow-hidden">
                            <Image
                                src={`/${overviewImage2}`}
                                alt={`${title} overview 2`}
                                fill
                                className="object-cover"
                                sizes="100vw"
                            />
                        </div>
                    )}
                    {overviewImage3 && (
                        <div className="relative w-full aspect-[16/9] overflow-hidden">
                            <Image
                                src={`/${overviewImage3}`}
                                alt={`${title} overview 3`}
                                fill
                                className="object-cover"
                                sizes="100vw"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 