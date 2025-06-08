import Link from 'next/link';

type ButtonVariant = 'nav' | 'project' | 'github';

interface ButtonProps {
    href?: string;
    children: React.ReactNode;
    variant?: ButtonVariant;
    isExternal?: boolean;
    onClick?: (e: React.MouseEvent) => void;
    className?: string;
    disabled?: boolean;
}

const baseButtonStyles = "inline-flex items-center px-4 py-2 text-white rounded transition-colors duration-200";

const variantStyles: Record<ButtonVariant, string> = {
    nav: "bg-gray-800 hover:bg-gray-900",
    project: "bg-blue-600 hover:bg-blue-700",
    github: "bg-green-600 hover:bg-green-700"
};

export function Button({ 
    href, 
    children, 
    variant = 'project', 
    isExternal = false, 
    onClick,
    className = '',
    disabled = false
}: ButtonProps) {
    const buttonClassName = `${baseButtonStyles} ${variantStyles[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

    if (onClick) {
        return (
            <button onClick={onClick} className={buttonClassName} disabled={disabled}>
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
                className={buttonClassName}
            >
                {children}
            </a>
        );
    }

    return (
        <Link href={href || '#'} className={buttonClassName}>
            {children}
        </Link>
    );
} 