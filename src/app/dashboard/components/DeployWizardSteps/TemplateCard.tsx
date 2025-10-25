"use client"

import { Template } from "@/hooks/useTemplates"
import { Check } from "lucide-react"

interface TemplateCardProps {
  template: Template
  isSelected: boolean
  onSelect: (template: Template) => void
}

export function TemplateCard({
  template,
  isSelected,
  onSelect,
}: TemplateCardProps) {
  return (
    <button
      onClick={() => onSelect(template)}
      className={`p-4 rounded-lg border-2 text-left transition-all h-full ${
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50 bg-background"
      }`}
    >
      <div className="space-y-3">
        {/* Header with title and verified badge */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-base flex-1 line-clamp-2">
            {template.name}
          </h3>
          {isSelected && (
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
              <Check className="w-3 h-3 text-primary-foreground" />
            </div>
          )}
        </div>

        {/* Category and verification badges */}
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-secondary/60 text-secondary-foreground text-xs rounded font-medium">
            {template.category}
          </span>
          {template.isVerified && (
            <span className="px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-400 text-xs rounded font-medium">
              Verified
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm line-clamp-2">
          {template.description || "No description available"}
        </p>

        {/* Meta info */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
          <span className="font-mono text-xs bg-secondary/20 px-2 py-1 rounded">
            {template.code}
          </span>
          {template.isV2Template && (
            <span className="text-xs font-medium text-primary">V2</span>
          )}
        </div>
      </div>
    </button>
  )
}
