import { type MouseEvent } from 'react';

export function Footer() {
    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        window.open('https://github.com/hankpharris', '_blank', 'noopener,noreferrer');
    };

    return (
        <footer className="w-full bg-[#003a96] dark:bg-[#001941] text-white text-sm py-6 shadow-lg shadow-black relative z-20">
            <div className="w-full px-4 flex justify-center items-center">
                <button
                    type="button"
                    onClick={handleClick}
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
        </footer>
    );
}
