import { cn } from "@/lib/utils";
import { Input } from "./input";
import { Label } from "./label";

interface FormInputProps {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    error?: string;
    hint?: string;
    className?: string;
}

export default function FormInput({
    label,
    name,
    type = "text",
    placeholder,
    error,
    hint,
    className,
}: FormInputProps) {
    return (
        <div className="space-y-1">
            <Label htmlFor={name} className="text-gray-700">
                {label}
            </Label>

            <Input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                className={cn(
                    "mt-1 focus-visible:ring-emerald-500",
                    error && "border-red-500 focus-visible:ring-red-400",
                    className
                )}
            />

            {hint && !error && (
                <p className="text-xs text-gray-400">{hint}</p>
            )}

            {error && (
                <p className="text-xs text-red-500">{error}</p>
            )}
        </div>
    );
}
