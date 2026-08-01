"use client";

import { useField } from "formik";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormInputProps extends Omit<React.ComponentProps<typeof Input>, "name"> {
  name: string;
  label?: string;
}

export default function FormInput({ name, label, className, ...props }: FormInputProps) {
  const [field, meta] = useField(name);
  const showError = meta.touched && !!meta.error;

  return (
    <div className="space-y-2">
      {label ? <Label htmlFor={name}>{label}</Label> : null}
      <Input id={name} aria-invalid={showError} className={cn(className)} {...field} {...props} />
      {showError ? <p className="text-xs text-destructive">{meta.error}</p> : null}
    </div>
  );
}
