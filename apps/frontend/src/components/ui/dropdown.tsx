import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ReactNode, useRef, useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";

interface DropdownMenuBaseProps {
    triggerText?: string;
    children: ReactNode;
}

export function DropdownMenuBase({ triggerText = "Menu", children }: DropdownMenuBaseProps) {
    const triggerRef = useRef<HTMLButtonElement>(null);
    const [triggerWidth, setTriggerWidth] = useState<number>(0);

    useEffect(() => {
        // Update the width of the dropdown when the component mounts
        if (triggerRef.current) {
            setTriggerWidth(triggerRef.current.offsetWidth);
        }
    }, []);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex items-center bg-[#003a96] dark:bg-[#001941] border border-none  text-white px-0  text-roboto py h-max:6 ">
                    <FaUserCircle className="h-8 w-auto fill-white" />
                    <Button
                        variant="outlineNoHover"
                        className={
                            "bg-transparent focus:outline-none shadow-none appearance-none border-0 p-1 text-white dark:bg-[#001941] hover:dark:bg-[#001941] hover:underline"
                        }
                        ref={triggerRef}
                    >
                        {triggerText}
                    </Button>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-auto" style={{ width: triggerWidth, minWidth: 110 }}>
                {children}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
