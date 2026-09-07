import Link from 'next/link';

type ButtonVariant = 'nav' | 'project' | 'github';

interface ButtonProps {
    href?: string;
    children: React.ReactNode;
    variant?: ButtonVariant;
    isExternal?: boolean;
    onClick?: (e: React.MouseEvent) => void;
    ariaLabel?: string;
}

const baseButtonStyles = "inline-flex items-center px-4 py-2 text-white rounded transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2";

const variantStyles: Record<ButtonVariant, string> = {
    nav: "bg-gray-800 hover:bg-gray-900",
    project: "bg-blue-600 hover:bg-blue-700",
    github: "bg-green-600 hover:bg-green-700"
};

export function Button({ href, children, variant = 'project', isExternal = false, onClick, ariaLabel }: ButtonProps) {
    const className = `${baseButtonStyles} ${variantStyles[variant]}`;

    if (onClick) {
        return (
            <button type="button" onClick={onClick} className={className} aria-label={ariaLabel}>
                {children}
            </button>
        );
    }

    if (isExternal) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
                aria-label={ariaLabel}
            >
                {children}
            </a>
        );
    }

    return (
        <Link href={href || '#'} className={className} aria-label={ariaLabel}>
            {children}
        </Link>
    );
} 