import { Link } from 'react-router-dom';

interface ButtonProps {
    href?: string;
    to?: string;
    children: React.ReactNode;
    className?: string;
}

const baseButtonStyles = "px-3 py-1 text-white rounded transition-colors text-sm inline-block";

export const ProjectLinkButton = ({ href, children }: ButtonProps) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseButtonStyles} bg-blue-600 hover:bg-blue-700`}
    >
        {children}
    </a>
);

export const ProjectGitHubButton = ({ href, children }: ButtonProps) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseButtonStyles} bg-gray-700 hover:bg-gray-800`}
    >
        {children}
    </a>
);

export const ProjectDetailsButton = ({ to, children }: ButtonProps) => (
    <Link
        to={to || ''}
        className={`${baseButtonStyles} bg-green-700 hover:bg-green-800`}
    >
        {children}
    </Link>
);

export const ButtonContainer = ({ children }: { children: React.ReactNode }) => (
    <div className="flex gap-2">
        {children}
    </div>
); 