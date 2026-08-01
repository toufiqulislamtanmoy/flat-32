"use client";

import { useField, useFormikContext } from "formik";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormCheckboxProps {
  name: string;
  label?: string;
  className?: string;
}

export default function FormCheckbox({ name, label, className }: FormCheckboxProps) {
  const [field, meta] = useField({ name, type: "checkbox" });
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const showError = meta.touched && !!meta.error;

  return (
    <div className="space-y-2">
      <div className={cn("flex items-center gap-2", className)}>
        <Checkbox
          id={name}
          checked={!!field.value}
          aria-invalid={showError}
          onCheckedChange={(checked) => {
            setFieldValue(name, !!checked);
            setFieldTouched(name, true);
          }}
        />
        {label ? <Label htmlFor={name}>{label}</Label> : null}
      </div>
      {showError ? <p className="text-xs text-destructive">{meta.error}</p> : null}
    </div>
  );
}
