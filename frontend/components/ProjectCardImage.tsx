import Image from 'next/image';

interface ProjectCardImageProps {
    src: string;
    alt: string;
    priority?: boolean;
}

export function ProjectCardImage({ src, alt, priority = false }: ProjectCardImageProps) {
    if (!src) {
        return (
            <div
                className="flex h-64 w-full items-center justify-center bg-white/40 text-sm text-gray-700"
                aria-hidden="true"
            >
                No image available
            </div>
        );
    }

    const imageSrc = src.startsWith('http') || src.startsWith('/') ? src : `/${src}`;

    return (
        <div className="relative w-full h-64 overflow-hidden">
            <Image
                src={imageSrc}
                alt={alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain"
                priority={priority}
            />
        </div>
    );
} 