import { Link } from "react-router-dom";
import { useTranslate } from "i18n";

export function Footer() {
    const handleClick = (e: React.MouseEvent) => {
        console.log('Button clicked!');
        e.preventDefault();
        window.open('https://github.com/hankpharris', '_blank', 'noopener,noreferrer');
    };

    return (
        <footer className="w-full bg-[#003a96] dark:bg-[#001941] text-white text-sm font-roboto py-6 shadow-lg shadow-black">
            <div className="w-full px-4 flex justify-center items-center">
                <button
                    type="button"
                    onClick={handleClick}
                    style={{
                        color: 'white',
                        textDecoration: 'none',
                        padding: '8px 16px',
                        border: '1px solid white',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        background: 'transparent',
                        fontSize: 'inherit',
                        fontFamily: 'inherit',
                        position: 'relative',
                        zIndex: 50
                    }}
                    onMouseOver={(e) => {
                        console.log('Mouse over button');
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.color = '#003a96';
                    }}
                    onMouseOut={(e) => {
                        console.log('Mouse out of button');
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'white';
                    }}
                >
                    GitHub: @hankpharris
                </button>
            </div>
        </footer>
    );
}
