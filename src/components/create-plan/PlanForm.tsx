"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { iconOptions, type IconOption } from "./mock-data";

interface PlanFormProps {
  selectedIcon: string;
  onIconSelect: (emoji: string) => void;
}

export default function PlanForm({ selectedIcon, onIconSelect }: PlanFormProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-natural">
          Plan Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Plan Name */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Plan Name <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Bachelor House"
            className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-white text-sm text-natural placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Description
          </label>
          <textarea
            placeholder="Describe this plan..."
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-sm text-natural placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition resize-none"
          />
        </div>

        {/* Start Date */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Start Date
          </label>
          <input
            type="date"
            defaultValue={new Date().toISOString().split("T")[0]}
            className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-white text-sm text-natural focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
          />
        </div>

        {/* Cover Icon */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-3">
            Cover Icon
          </label>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {iconOptions.map((option: IconOption) => (
              <button
                key={option.label}
                type="button"
                onClick={() => onIconSelect(option.emoji)}
                className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all cursor-pointer hover:bg-login-background ${
                  selectedIcon === option.emoji
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-gray-200"
                }`}
              >
                <span className="text-2xl">{option.emoji}</span>
                <span className="text-xs text-muted-foreground">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
