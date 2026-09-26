import { useId } from "react";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  showText?: boolean;
  textClassName?: string;
}

// Same mark as src/app/icon.svg so favicon and in-app logo stay identical
export const BrandMark = ({ className }: { className?: string }) => {
  // Unique gradient id per instance — a shared id breaks when the first copy is display:none
  const gradientId = `brand-mark-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className={cn("h-9 w-9", className)}>
      <defs>
        <linearGradient
          id={gradientId}
          x1="0"
          y1="0"
          x2="64"
          y2="64"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#00d1ff" />
          <stop offset="0.55" stopColor="#00a3c4" />
          <stop offset="1" stopColor="#00677f" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill={`url(#${gradientId})`} />
      <path d="M15 26 L24 15 H50 V18 A8 8 0 0 1 42 26 Z" fill="#ffffff" />
      <path
        d="M15 50 V39 L24 30 H44 V32 A7 7 0 0 1 37 39 H27 V44 A6 6 0 0 1 21 50 Z"
        fill="#ffffff"
        fillOpacity="0.82"
      />
      <circle cx="47" cy="45" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
    </svg>
  );
};

const BrandLogo = ({ className, showText = true, textClassName }: BrandLogoProps) => {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <BrandMark />
      {showText && (
        <span className={cn("text-lg font-bold tracking-tight text-natural", textClassName)}>
          Flat Mate
        </span>
      )}
    </span>
  );
};

export default BrandLogo;
