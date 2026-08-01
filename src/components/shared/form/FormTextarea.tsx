"use client";

import { useField } from "formik";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormTextareaProps extends Omit<React.ComponentProps<typeof Textarea>, "name"> {
  name: string;
  label?: string;
}

export default function FormTextarea({ name, label, className, ...props }: FormTextareaProps) {
  const [field, meta] = useField(name);
  const showError = meta.touched && !!meta.error;

  return (
    <div className="space-y-2">
      {label ? <Label htmlFor={name}>{label}</Label> : null}
      <Textarea
        id={name}
        aria-invalid={showError}
        className={cn(className)}
        {...field}
        {...props}
      />
      {showError ? <p className="text-xs text-destructive">{meta.error}</p> : null}
    </div>
  );
}
