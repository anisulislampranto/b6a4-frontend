import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormInputProps {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    hint?: string;
    field?: any;
}

export default function FormInput({
    label,
    type = "text",
    placeholder,
    hint,
    field,
}: FormInputProps) {
    const errors = field?.state.meta.errors;

    const errorMessage =
        Array.isArray(errors) && errors.length
            ? typeof errors[0] === "string"
                ? errors[0]
                : errors[0]?.message
            : null;

    return (
        <div className="space-y-1">
            <Label>{label}</Label>

            <Input
                type={type}
                placeholder={placeholder}
                value={field?.state.value ?? ""}
                onChange={(e) => field?.handleChange(e.target.value)}
                onBlur={field?.handleBlur}
                className={cn(
                    "mt-1",
                    errorMessage && "border-red-500 focus-visible:ring-red-500"
                )}
            />

            {hint && !errorMessage && (
                <p className="text-xs text-gray-400">{hint}</p>
            )}

            {errorMessage && (
                <p className="text-xs text-red-500">{errorMessage}</p>
            )}
        </div>
    );
}
