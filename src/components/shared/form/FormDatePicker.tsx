"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useField, useFormikContext } from "formik";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface FormDatePickerProps {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
}

export default function FormDatePicker({
  name,
  label,
  placeholder = "Pick a date",
  className,
}: FormDatePickerProps) {
  const [field, meta] = useField(name);
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const [open, setOpen] = useState(false);
  const showError = meta.touched && !!meta.error;
  const selectedDate = field.value ? new Date(field.value) : undefined;

  return (
    <div className="space-y-2">
      {label ? <Label htmlFor={name}>{label}</Label> : null}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              id={name}
              type="button"
              variant="outline"
              aria-invalid={showError}
              className={cn(
                "w-full justify-start gap-2 font-normal",
                !selectedDate && "text-muted-foreground",
                className
              )}
            />
          }
        >
          <CalendarIcon className="size-4" />
          {selectedDate ? format(selectedDate, "PPP") : placeholder}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            captionLayout="dropdown"
            onSelect={(date) => {
              setFieldValue(name, date ? format(date, "yyyy-MM-dd") : "");
              setFieldTouched(name, true);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
      {showError ? <p className="text-xs text-destructive">{meta.error}</p> : null}
    </div>
  );
}
