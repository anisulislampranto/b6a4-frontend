import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormInputProps {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    hint?: string;
    field?: FormFieldLike;
}

interface FormFieldLike {
    state?: {
        value?: string | number;
        meta?: {
            errors?: Array<string | { message?: string } | null | undefined>;
        };
    };
    handleChange?: (value: string) => void;
    handleBlur?: () => void;
}

export default function FormInput({
    label,
    type = "text",
    placeholder,
    hint,
    field,
}: FormInputProps) {
    const fieldState = field?.state;
    const errors = fieldState?.meta?.errors;

    const errorMessage =
        Array.isArray(errors) && errors.length
            ? typeof errors[0] === "string"
                ? errors[0]
                : errors[0]?.message
            : null;

    return (
        <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-foreground/90">{label}</Label>

            <Input
                type={type}
                placeholder={placeholder}
                value={fieldState?.value ?? ""}
                onChange={(e) => field?.handleChange?.(e.target.value)}
                onBlur={field?.handleBlur}
                className={cn(
                    "mt-1",
                    errorMessage && "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200"
                )}
            />

            {hint && !errorMessage && (
                <p className="text-xs text-muted-foreground">{hint}</p>
            )}

            {errorMessage && (
                <p className="text-xs font-medium text-red-600">{errorMessage}</p>
            )}
        </div>
    );
}
