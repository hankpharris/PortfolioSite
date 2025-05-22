import { type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export function Header() {
    const navigate = useNavigate();
    const handleGitHubClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        window.open('https://github.com/hankpharris', '_blank', 'noopener,noreferrer');
    };

    return (
        <header className="w-full bg-[#003a96] dark:bg-[#001941] text-white text-sm py-3 relative z-20">
            <div className="w-full px-4 flex justify-center items-center gap-4">
                <button
                    type="button"
                    onClick={() => navigate('/projects')}
                    className="
                        px-4 py-2
                        border border-white rounded
                        bg-transparent text-white
                        hover:bg-white hover:text-[#003a96]
                        transition-colors duration-200
                        cursor-pointer
                        text-inherit font-inherit
                        relative z-50
                    "
                >
                    Projects
                </button>
                <button
                    type="button"
                    onClick={() => navigate('/about')}
                    className="
                        px-4 py-2
                        border border-white rounded
                        bg-transparent text-white
                        hover:bg-white hover:text-[#003a96]
                        transition-colors duration-200
                        cursor-pointer
                        text-inherit font-inherit
                        relative z-50
                    "
                >
                    About Me
                </button>
                <button
                    type="button"
                    onClick={handleGitHubClick}
                    className="
                        px-4 py-2
                        border border-white rounded
                        bg-transparent text-white
                        hover:bg-white hover:text-[#003a96]
                        transition-colors duration-200
                        cursor-pointer
                        text-inherit font-inherit
                        relative z-50
                    "
                >
                    GitHub: @hankpharris
                </button>
            </div>
        </header>
    );
} 