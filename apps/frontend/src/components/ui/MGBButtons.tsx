import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ButtonProps {
    path: string;
    text: string;
    variant?: "primary" | "secondary";
}

export function MGBButtons({ path, text, variant = "primary" }: ButtonProps) {
    const navigate = useNavigate();

    function handleClick() {
        navigate(path);
    }

    const variantClasses = {
        primary:
            "bg-[#c2d0e6] dark:bg-[#00245d] border border-black dark:border-white text-black dark:text-white hover:bg-[#003a96] hover:dark:bg-[#c2d0e6] hover:text-white hover:dark:text-black px-4 py-2",
        secondary:
            "bg-white text-black border border-black hover:bg-[#001941] hover:text-white px-4 py-2 text-sm",
    };

    return (
        <Button
            className={`rounded-2xl flex gap-2 text-roboto ${variantClasses[variant]}`}
            onClick={handleClick}
        >
            {text}
        </Button>
    );
}
