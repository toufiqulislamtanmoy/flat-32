"use client";

import { useField, useFormikContext } from "formik";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface FormSelectOption {
  label: string;
  value: string;
}

interface FormSelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  options: FormSelectOption[];
  className?: string;
}

export default function FormSelect({
  name,
  label,
  placeholder = "Select an option",
  options,
  className,
}: FormSelectProps) {
  const [field, meta] = useField(name);
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const showError = meta.touched && !!meta.error;

  return (
    <div className="space-y-2">
      {label ? <Label htmlFor={name}>{label}</Label> : null}
      <Select
        value={field.value || undefined}
        onValueChange={(value) => {
          setFieldValue(name, value);
          setFieldTouched(name, true);
        }}
      >
        <SelectTrigger id={name} aria-invalid={showError} className={cn("w-full", className)}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {showError ? <p className="text-xs text-destructive">{meta.error}</p> : null}
    </div>
  );
}
