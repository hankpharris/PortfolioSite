"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type ComboboxProps = {
    options: { value: string; label: string }[];
    value?: string;
    onChange: (option: { value: string; label: string }) => void;
};

export function Combobox({ options, value, onChange }: ComboboxProps) {
    const [open, setOpen] = React.useState(false);

    const selectedOption = options.find(opt => opt.value === value);

    const triggerRef = React.useCallback(
        (el: HTMLButtonElement) => {
            if (!el) return;
            const label =
                el.closest("label")?.textContent?.trim() ||
                el.getAttribute("aria-label") ||
                el.getAttribute("title") ||
                "";
            if (!label) return;

            return () => {
            };
        },
        []
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    ref={triggerRef}
                >
                    {selectedOption ? selectedOption.label : "Select an option..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Search..." />
                    <CommandList>
                        <CommandEmpty>No match found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option, index) => (
                                <CommandItem
                                    key={option.value || index}
                                    value={option.label ? option.label.toLowerCase() : ""}
                                    onSelect={() => {
                                        onChange(option);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === option.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
